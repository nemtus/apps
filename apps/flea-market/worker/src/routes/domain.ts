/**
 * flea-market domain API — replaces the Firestore reads/writes + Cloud Functions
 * fan-out. In D1 the Firestore public/private + buyer/store dual copies collapse
 * into single `store`/`item`/`order` tables, so "public" vs "owner" reads are just
 * query filters (no fan-out). Public visibility = the owner is `storeKycVerified`
 * (mirrors the old public `stores/*` copy that functions only published post-KYC).
 *
 * Deferred (tracked follow-ups): the KYC store-challenge verify callables
 * (email/phone/address secrets + rate limiting) and syncing `userKycVerified` to
 * Better Auth `emailVerified`. KYC flags are surfaced read-only here for now.
 */
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import { putObject } from '@nemtus/storage';
import { buildAuth } from '../build-auth';
import { createDb, schema } from '../db';
import { httpError, json, readJson, requireUser } from '../http';
import type { RouteContext } from '../router';
import type { Router } from '../router';
import { toItemJson, toOrderJson, toStoreJson, toUserJson } from '../lib/mappers';
import { verifyXymTransfer } from '../lib/symbol';
import { computeStoreKyc } from '../lib/kyc';
import { createOrderRoute } from './orders';
import { createSesSender, storeEmailVerificationEmail } from '@nemtus/email';

type Db = ReturnType<typeof createDb>;

function flagEnabled(v: string | undefined): boolean {
  return v !== 'false';
}

/** Opt-in flag: enabled only when explicitly "true" (default off). */
function flagEnabledStrict(v: string | undefined): boolean {
  return v === 'true';
}

function optStr(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function reqStr(v: unknown, field: string): string {
  if (typeof v !== 'string' || v.length === 0) throw httpError(`${field}_required`, 400);
  return v;
}

async function loadProfile(db: Db, userId: string) {
  const rows = await db.select().from(schema.userProfile).where(eq(schema.userProfile.userId, userId));
  return rows[0];
}

/** A store is publicly visible only when its owner has passed store KYC. */
async function findPublishedStore(db: Db, storeId: string) {
  const rows = await db
    .select({ store: getTableColumns(schema.store) })
    .from(schema.store)
    .innerJoin(schema.userProfile, eq(schema.store.ownerUserId, schema.userProfile.userId))
    .where(and(eq(schema.store.id, storeId), eq(schema.userProfile.storeKycVerified, true)));
  return rows[0]?.store;
}

// ---------- public reads ----------

function getConfig(ctx: RouteContext): Response {
  const { env } = ctx;
  return json({
    enableCreateUser: flagEnabled(env.ENABLE_CREATE_USER),
    enableCreateStore: flagEnabled(env.ENABLE_CREATE_STORE),
    enableCreateItem: flagEnabled(env.ENABLE_CREATE_ITEM),
    enableCreateOrder: flagEnabled(env.ENABLE_CREATE_ORDER),
    enableStorePhoneVerification: flagEnabledStrict(env.ENABLE_STORE_PHONE_VERIFICATION),
    enableStoreAddressVerification: flagEnabledStrict(env.ENABLE_STORE_ADDRESS_VERIFICATION),
  });
}

async function listStores(ctx: RouteContext): Promise<Response> {
  const db = createDb(ctx.env.DB);
  const rows = await db
    .select({ store: getTableColumns(schema.store) })
    .from(schema.store)
    .innerJoin(schema.userProfile, eq(schema.store.ownerUserId, schema.userProfile.userId))
    .where(eq(schema.userProfile.storeKycVerified, true));
  return json(rows.map((r) => toStoreJson(r.store)));
}

async function getStore(ctx: RouteContext): Promise<Response> {
  const db = createDb(ctx.env.DB);
  const store = await findPublishedStore(db, ctx.params.storeId!);
  if (!store) throw httpError('not_found', 404);
  return json(toStoreJson(store));
}

async function listStoreItems(ctx: RouteContext): Promise<Response> {
  const db = createDb(ctx.env.DB);
  const store = await findPublishedStore(db, ctx.params.storeId!);
  if (!store) throw httpError('not_found', 404);
  const items = await db.select().from(schema.item).where(eq(schema.item.storeId, store.id));
  return json(items.map(toItemJson));
}

async function getStoreItem(ctx: RouteContext): Promise<Response> {
  const db = createDb(ctx.env.DB);
  const store = await findPublishedStore(db, ctx.params.storeId!);
  if (!store) throw httpError('not_found', 404);
  const rows = await db
    .select()
    .from(schema.item)
    .where(and(eq(schema.item.id, ctx.params.itemId!), eq(schema.item.storeId, store.id)));
  if (!rows[0]) throw httpError('not_found', 404);
  return json(toItemJson(rows[0]));
}

// ---------- owner: profile ----------

async function getMe(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const profile = await loadProfile(db, user.id);
  return json(toUserJson(user, profile));
}

async function putMe(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const body = await readJson<Record<string, unknown>>(ctx.request);
  const now = new Date();

  if (typeof body.name === 'string' && body.name.length > 0) {
    await db.update(schema.user).set({ name: body.name, updatedAt: now }).where(eq(schema.user.id, user.id));
  }

  const profileValues = {
    phoneNumber: optStr(body.phoneNumber),
    zipCode: optStr(body.zipCode),
    address1: optStr(body.address1),
    address2: optStr(body.address2),
    symbolAddress: optStr(body.symbolAddress),
    updatedAt: now,
  };
  await db
    .insert(schema.userProfile)
    .values({ userId: user.id, ...profileValues, createdAt: now })
    .onConflictDoUpdate({ target: schema.userProfile.userId, set: profileValues });

  const refreshed = await requireUser(ctx);
  const profile = await loadProfile(db, user.id);
  return json(toUserJson(refreshed, profile));
}

// ---------- owner: store ----------

async function getMyStore(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const rows = await db.select().from(schema.store).where(eq(schema.store.id, user.id));
  if (!rows[0]) throw httpError('not_found', 404);
  return json(toStoreJson(rows[0]));
}

async function putMyStore(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const body = await readJson<Record<string, unknown>>(ctx.request);
  const now = new Date();
  const mutable = {
    name: reqStr(body.storeName, 'storeName'),
    email: optStr(body.storeEmail),
    phoneNumber: optStr(body.storePhoneNumber),
    zipCode: optStr(body.storeZipCode),
    address1: optStr(body.storeAddress1),
    address2: optStr(body.storeAddress2),
    url: optStr(body.storeUrl),
    symbolAddress: optStr(body.storeSymbolAddress),
    description: optStr(body.storeDescription),
    imageUrl: optStr(body.storeImageFile),
    coverImageUrl: optStr(body.storeCoverImageFile),
    updatedAt: now,
  };
  await db
    .insert(schema.store)
    .values({ id: user.id, ownerUserId: user.id, ...mutable, createdAt: now })
    .onConflictDoUpdate({ target: schema.store.id, set: mutable });
  const rows = await db.select().from(schema.store).where(eq(schema.store.id, user.id));
  return json(toStoreJson(rows[0]!));
}

// ---------- owner: items ----------

async function listMyItems(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const items = await db.select().from(schema.item).where(eq(schema.item.storeId, user.id));
  return json(items.map(toItemJson));
}

function readItemFields(body: Record<string, unknown>) {
  const price = body.itemPrice;
  if (typeof price !== 'number' || !Number.isInteger(price) || price < 0) {
    throw httpError('invalid_itemPrice', 400);
  }
  const status = body.itemStatus === 'ON_SALE' ? 'ON_SALE' : 'SOLD_OUT';
  return {
    name: reqStr(body.itemName, 'itemName'),
    priceJpy: price,
    priceUnit: 'JPY',
    description: optStr(body.itemDescription),
    imageUrl: optStr(body.itemImageFile),
    status: status as 'ON_SALE' | 'SOLD_OUT',
  };
}

async function createMyItem(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const store = await db.select().from(schema.store).where(eq(schema.store.id, user.id));
  if (!store[0]) throw httpError('store_required', 409);
  const body = await readJson<Record<string, unknown>>(ctx.request);
  const fields = readItemFields(body);
  const now = new Date();
  const id = crypto.randomUUID();
  await db.insert(schema.item).values({ id, storeId: user.id, ...fields, createdAt: now, updatedAt: now });
  const rows = await db.select().from(schema.item).where(eq(schema.item.id, id));
  return json(toItemJson(rows[0]!), 201);
}

async function updateMyItem(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const rows = await db.select().from(schema.item).where(eq(schema.item.id, ctx.params.itemId!));
  const existing = rows[0];
  if (!existing) throw httpError('not_found', 404);
  if (existing.storeId !== user.id) throw httpError('forbidden', 403);
  const body = await readJson<Record<string, unknown>>(ctx.request);
  const fields = readItemFields(body);
  await db
    .update(schema.item)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(schema.item.id, existing.id));
  const updated = await db.select().from(schema.item).where(eq(schema.item.id, existing.id));
  return json(toItemJson(updated[0]!));
}

// ---------- orders (reads) ----------

/**
 * Batch-load the buyer (core user + profile), store, and item rows for a set of
 * orders and map to the denormalized OrderJson the SPA reads. Batched (one query
 * per related table) rather than per-order to avoid N+1.
 */
async function loadOrderJsons(db: Db, orders: (typeof schema.order.$inferSelect)[]) {
  if (orders.length === 0) return [];
  const buyerIds = [...new Set(orders.map((o) => o.buyerUserId))];
  const storeIds = [...new Set(orders.map((o) => o.storeId))];
  const itemIds = [...new Set(orders.map((o) => o.itemId))];
  const [users, profiles, stores, items] = await Promise.all([
    db.select().from(schema.user).where(inArray(schema.user.id, buyerIds)),
    db.select().from(schema.userProfile).where(inArray(schema.userProfile.userId, buyerIds)),
    db.select().from(schema.store).where(inArray(schema.store.id, storeIds)),
    db.select().from(schema.item).where(inArray(schema.item.id, itemIds)),
  ]);
  const userById = new Map(users.map((u) => [u.id, u]));
  const profileById = new Map(profiles.map((p) => [p.userId, p]));
  const storeById = new Map(stores.map((st) => [st.id, st]));
  const itemById = new Map(items.map((it) => [it.id, it]));
  return orders.map((o) =>
    toOrderJson(
      o,
      userById.get(o.buyerUserId),
      profileById.get(o.buyerUserId),
      storeById.get(o.storeId),
      itemById.get(o.itemId),
    ),
  );
}

async function listMyOrders(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const orders = await db.select().from(schema.order).where(eq(schema.order.buyerUserId, user.id));
  return json(await loadOrderJsons(db, orders));
}

async function listMyStoreOrders(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const orders = await db.select().from(schema.order).where(eq(schema.order.storeId, user.id));
  return json(await loadOrderJsons(db, orders));
}

async function getOrder(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const rows = await db.select().from(schema.order).where(eq(schema.order.id, ctx.params.orderId!));
  const order = rows[0];
  if (!order) throw httpError('not_found', 404);
  // Visible to the buyer or the selling store's owner (store.id === owner userId).
  if (order.buyerUserId !== user.id && order.storeId !== user.id) {
    throw httpError('forbidden', 403);
  }
  const [orderJson] = await loadOrderJsons(db, [order]);
  return json(orderJson);
}

/**
 * XYM payment verification (polled by the buyer's order page). The worker searches
 * the store's confirmed transfers for one carrying this orderId as its message and a
 * sufficient amount (never trusting the client), and on a match advances the order to
 * CONFIRMED + records the tx hash. When no matching transfer is found yet it returns
 * the still-PENDING order (200) so the client can keep polling.
 */
async function verifyOrderPayment(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const rows = await db.select().from(schema.order).where(eq(schema.order.id, ctx.params.orderId!));
  const order = rows[0];
  if (!order) throw httpError('not_found', 404);
  if (order.buyerUserId !== user.id) throw httpError('forbidden', 403);
  if (order.paymentMethod !== 'XYM') throw httpError('not_xym_order', 400);

  // Idempotent: already-confirmed orders just return their current state.
  if (order.orderStatus === 'CONFIRMED') {
    const [orderJson] = await loadOrderJsons(db, [order]);
    return json(orderJson);
  }
  if (order.orderStatus !== 'PENDING' && order.orderStatus !== 'UNCONFIRMED') {
    throw httpError('order_not_payable', 409);
  }
  if (!ctx.env.SYMBOL_NODE_URL || !ctx.env.SYMBOL_CURRENCY_MOSAIC_ID) {
    throw httpError('symbol_not_configured', 503);
  }

  const stores = await db.select().from(schema.store).where(eq(schema.store.id, order.storeId));
  const store = stores[0];
  if (!store?.symbolAddress) throw httpError('store_symbol_address_missing', 409);

  const result = await verifyXymTransfer({
    nodeUrl: ctx.env.SYMBOL_NODE_URL,
    storeAddress: store.symbolAddress,
    orderId: order.id,
    minMicros: BigInt(order.totalPriceCc ?? 0),
    currencyMosaicId: ctx.env.SYMBOL_CURRENCY_MOSAIC_ID,
  });
  if (!result.ok) {
    // Not confirmed yet (tx_not_found / insufficient_amount) or a node hiccup — return
    // the current (still-PENDING) order so the client keeps polling.
    const [orderJson] = await loadOrderJsons(db, [order]);
    return json(orderJson);
  }

  await db
    .update(schema.order)
    .set({ orderStatus: 'CONFIRMED', symbolTxHash: result.txHash, updatedAt: new Date() })
    .where(eq(schema.order.id, order.id));
  const updated = await db.select().from(schema.order).where(eq(schema.order.id, order.id));
  const [orderJson] = await loadOrderJsons(db, [updated[0]!]);
  return json(orderJson);
}

// ---------- store email KYC (challenge via SES) ----------

async function requestStoreEmailVerification(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const db = createDb(ctx.env.DB);
  const stores = await db.select().from(schema.store).where(eq(schema.store.id, user.id));
  const store = stores[0];
  if (!store?.email) throw httpError('store_email_missing', 409);

  // 6-digit code, kept in KV for 15 min, emailed to the store address via SES.
  const rand = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
  const code = String(rand % 1_000_000).padStart(6, '0');
  await ctx.env.APP_KV.put(`store-email-verify:${user.id}`, code, { expirationTtl: 900 });

  const sender = createSesSender({
    region: ctx.env.AWS_REGION,
    accessKeyId: ctx.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: ctx.env.AWS_SECRET_ACCESS_KEY,
    defaultFrom: ctx.env.AWS_SES_FROM,
  });
  const content = storeEmailVerificationEmail(code);
  try {
    await sender.send({ to: store.email, subject: content.subject, text: content.text, html: content.html });
  } catch {
    throw httpError('email_send_failed', 502);
  }
  return json({ ok: true });
}

async function verifyStoreEmail(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const body = await readJson<{ code?: string }>(ctx.request);
  const code = body.code?.trim();
  if (!code) throw httpError('code_required', 400);

  const key = `store-email-verify:${user.id}`;
  const stored = await ctx.env.APP_KV.get(key);
  if (!stored || stored !== code) throw httpError('invalid_code', 400);
  await ctx.env.APP_KV.delete(key);

  const db = createDb(ctx.env.DB);
  const profile = await loadProfile(db, user.id);
  if (!profile) throw httpError('profile_not_found', 409);

  const storeKycVerified = computeStoreKyc({
    storeEmailVerified: true,
    storePhoneNumberVerified: profile.storePhoneNumberVerified,
    storeAddressVerified: profile.storeAddressVerified,
    phoneRequired: flagEnabledStrict(ctx.env.ENABLE_STORE_PHONE_VERIFICATION),
    addressRequired: flagEnabledStrict(ctx.env.ENABLE_STORE_ADDRESS_VERIFICATION),
  });
  await db
    .update(schema.userProfile)
    .set({ storeEmailVerified: true, storeKycVerified, updatedAt: new Date() })
    .where(eq(schema.userProfile.userId, user.id));
  const updated = await loadProfile(db, user.id);
  return json(toUserJson(user, updated));
}

// ---------- owner: image upload (R2) ----------

const IMAGE_EXT: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
};
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

async function uploadImage(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const contentType = ctx.request.headers.get('content-type')?.split(';')[0]?.trim() ?? '';
  const ext = IMAGE_EXT[contentType];
  if (!ext) throw httpError('unsupported_media_type', 415);

  const body = await ctx.request.arrayBuffer();
  if (body.byteLength === 0) throw httpError('empty_body', 400);
  if (body.byteLength > MAX_UPLOAD_BYTES) throw httpError('payload_too_large', 413);

  // Keys mirror the Firebase Storage convention and include `/images/` so the
  // public GET /api/files/<key> route will serve them (store.id === owner userId).
  const scope = ctx.url.searchParams.get('scope');
  const name = `${crypto.randomUUID()}${ext}`;
  const db = createDb(ctx.env.DB);
  let key: string;
  let itemId: string | null = null;
  if (scope === 'item') {
    itemId = ctx.url.searchParams.get('itemId');
    if (!itemId) throw httpError('itemId_required', 400);
    const rows = await db.select().from(schema.item).where(eq(schema.item.id, itemId));
    if (!rows[0]) throw httpError('not_found', 404);
    if (rows[0].storeId !== user.id) throw httpError('forbidden', 403);
    key = `users/${user.id}/stores/${user.id}/items/${itemId}/images/${name}`;
  } else if (scope === 'store') {
    key = `users/${user.id}/stores/${user.id}/images/${name}`;
  } else {
    throw httpError('invalid_scope', 400);
  }

  await putObject(ctx.env.BUCKET, key, body, { contentType, cacheControl: 'public, max-age=31536000' });
  const url = `/api/flea-market/files/${key}`;
  // Persist the URL onto the record, mirroring the old client-side setDoc after upload.
  const now = new Date();
  if (scope === 'item' && itemId) {
    await db.update(schema.item).set({ imageUrl: url, updatedAt: now }).where(eq(schema.item.id, itemId));
  } else {
    await db.update(schema.store).set({ imageUrl: url, updatedAt: now }).where(eq(schema.store.id, user.id));
  }
  return json({ key, url }, 201);
}

/**
 * Register every flea-market domain-API route on the shared router, namespaced
 * under `/api/flea-market/*`. Core auth stays at `/api/auth/*` (handled in index.ts).
 */
export function registerDomainRoutes(router: Router): void {
  router
    .get('/api/flea-market/config', getConfig)
    .get('/api/flea-market/stores', listStores)
    .get('/api/flea-market/stores/:storeId', getStore)
    .get('/api/flea-market/stores/:storeId/items', listStoreItems)
    .get('/api/flea-market/stores/:storeId/items/:itemId', getStoreItem)
    .get('/api/flea-market/me', getMe)
    .put('/api/flea-market/me', putMe)
    .get('/api/flea-market/me/store', getMyStore)
    .put('/api/flea-market/me/store', putMyStore)
    .post('/api/flea-market/me/store/verify-email/challenge', requestStoreEmailVerification)
    .post('/api/flea-market/me/store/verify-email', verifyStoreEmail)
    .get('/api/flea-market/me/store/items', listMyItems)
    .post('/api/flea-market/me/store/items', createMyItem)
    .put('/api/flea-market/me/store/items/:itemId', updateMyItem)
    .get('/api/flea-market/me/orders', listMyOrders)
    .get('/api/flea-market/me/store/orders', listMyStoreOrders)
    .get('/api/flea-market/orders/:orderId', getOrder)
    .post('/api/flea-market/orders/:orderId/verify-payment', verifyOrderPayment)
    .post('/api/flea-market/orders', (ctx) => createOrderRoute(ctx.request, ctx.env, buildAuth(ctx.env, ctx.execCtx)))
    .post('/api/flea-market/me/uploads', uploadImage);
}
