/**
 * Create an order — dual-rail: Stripe Checkout or on-chain XYM.
 *
 *   POST /api/flea-market/orders   { itemId, quantity?, paymentMethod? }
 *     paymentMethod 'STRIPE' (default) -> 200 { orderId, url }  (url = Stripe Checkout page)
 *     paymentMethod 'XYM'              -> 201 { orderId }        (client renders the transfer QR)
 *
 * Gated on an authenticated, KYC-verified buyer.
 */
import { eq } from 'drizzle-orm';
import { createCheckoutSession, createStripe } from '@nemtus/billing';
import type { Auth } from '@nemtus/auth';
import { createDb, schema } from '../db';
import type { Env } from '../env';
import type { PaymentMethod } from '../schema/domain';
import { getXymJpyRate } from '../lib/price';

interface CreateOrderBody {
  itemId?: string;
  quantity?: number;
  /** Payment rail. Defaults to STRIPE (backward-compatible). */
  paymentMethod?: PaymentMethod;
}

/**
 * XYM micro-amount (absolute 6-decimal units) for a JPY total at a JPY/XYM rate.
 * Rounds UP so rate rounding never leaves the buyer underpaying the JPY value.
 */
export function computeXymMicros(totalJpy: number, xymJpyRate: number): number {
  if (!(xymJpyRate > 0)) throw new Error('invalid_rate');
  return Math.ceil((totalJpy / xymJpyRate) * 1_000_000);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function createOrderRoute(request: Request, env: Env, auth: Auth): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return json({ error: 'unauthorized' }, 401);

  const buyer = session.user as { id: string; name?: string };
  const db = createDb(env.DB);

  // KYC gate — the flags live in flea_market_user_profile (not the shared user table).
  const profiles = await db.select().from(schema.userProfile).where(eq(schema.userProfile.userId, buyer.id));
  const profile = profiles[0];
  if (!profile?.userKycVerified) return json({ error: 'kyc_required' }, 403);

  const body = (await request.json().catch(() => ({}))) as CreateOrderBody;
  if (!body.itemId) return json({ error: 'itemId required' }, 400);

  // Reject invalid quantities instead of silently coercing; default only when omitted.
  let quantity = 1;
  if (body.quantity !== undefined) {
    if (typeof body.quantity !== 'number' || !Number.isInteger(body.quantity) || body.quantity < 1) {
      return json({ error: 'invalid_quantity' }, 400);
    }
    quantity = body.quantity;
  }

  const items = await db.select().from(schema.item).where(eq(schema.item.id, body.itemId));
  const it = items[0];
  if (!it || it.status !== 'ON_SALE') return json({ error: 'item_unavailable' }, 404);

  const total = it.priceJpy * quantity;
  const orderId = crypto.randomUUID();
  const now = new Date();

  // XYM rail: settle on-chain. The buyer sends a transfer (rendered as QR/URI by the
  // client) to the store's Symbol address with orderId as the message; the client
  // then notifies the verify endpoint, which re-checks it via the Symbol REST API.
  if (body.paymentMethod === 'XYM') {
    return createXymOrder(
      { db, buyerId: buyer.id, buyerName: buyer.name, profile, item: it, quantity, total, orderId, now },
      env,
    );
  }

  // Snapshot the buyer's shipping details (from the profile loaded above for the KYC
  // gate) onto the order so it stays fulfillable even if the profile later changes.
  await db.insert(schema.order).values({
    id: orderId,
    buyerUserId: buyer.id,
    storeId: it.storeId,
    itemId: it.id,
    itemNameSnapshot: it.name,
    quantity,
    totalJpy: total,
    paymentStatus: 'PENDING',
    shipName: buyer.name ?? null,
    shipPhone: profile?.phoneNumber ?? null,
    shipZip: profile?.zipCode ?? null,
    shipAddress1: profile?.address1 ?? null,
    shipAddress2: profile?.address2 ?? null,
    createdAt: now,
    updatedAt: now,
  });

  const stripe = createStripe(env.STRIPE_SECRET_KEY);
  let checkout;
  try {
    checkout = await createCheckoutSession(stripe, {
      orderId,
      name: it.name,
      amount: total, // JPY is zero-decimal
      quantity,
      successUrl: env.CHECKOUT_SUCCESS_URL,
      cancelUrl: env.CHECKOUT_CANCEL_URL,
      customerEmail: (session.user as { email?: string }).email,
    });
  } catch {
    // Don't leave an unreconcilable PENDING row with no Stripe id.
    await db
      .update(schema.order)
      .set({ paymentStatus: 'FAILED', updatedAt: new Date() })
      .where(eq(schema.order.id, orderId));
    return json({ error: 'checkout_failed' }, 502);
  }

  await db
    .update(schema.order)
    .set({ stripeSessionId: checkout.id, updatedAt: new Date() })
    .where(eq(schema.order.id, orderId));

  return json({ orderId, url: checkout.url });
}

interface XymOrderContext {
  db: ReturnType<typeof createDb>;
  buyerId: string;
  buyerName?: string;
  profile: typeof schema.userProfile.$inferSelect;
  item: typeof schema.item.$inferSelect;
  quantity: number;
  total: number;
  orderId: string;
  now: Date;
}

async function createXymOrder(c: XymOrderContext, env: Env): Promise<Response> {
  const { db, buyerId, buyerName, profile, item, quantity, total, orderId, now } = c;

  // The store's Symbol payout address is the transfer recipient — required.
  const stores = await db.select().from(schema.store).where(eq(schema.store.id, item.storeId));
  const store = stores[0];
  if (!store?.symbolAddress) return json({ error: 'store_symbol_address_missing' }, 409);

  let rate: number;
  try {
    rate = await getXymJpyRate(env);
  } catch {
    return json({ error: 'xym_jpy_rate_unavailable' }, 503);
  }
  const totalPriceCc = computeXymMicros(total, rate);

  await db.insert(schema.order).values({
    id: orderId,
    buyerUserId: buyerId,
    storeId: item.storeId,
    itemId: item.id,
    itemNameSnapshot: item.name,
    quantity,
    totalJpy: total,
    paymentMethod: 'XYM',
    orderStatus: 'PENDING',
    totalPriceCc,
    shipName: buyerName ?? null,
    shipPhone: profile.phoneNumber ?? null,
    shipZip: profile.zipCode ?? null,
    shipAddress1: profile.address1 ?? null,
    shipAddress2: profile.address2 ?? null,
    createdAt: now,
    updatedAt: now,
  });

  // The client navigates to the order page, which fetches the full (fat) order and
  // renders the QR/URI + starts monitoring. No Stripe Checkout URL for this rail.
  return json({ orderId }, 201);
}
