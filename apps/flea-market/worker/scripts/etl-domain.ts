/**
 * Stage 2 of the Firestore → D1 domain migration: transform the JSONL dumped by
 * dump-firestore.ts into D1 SQL for the store / item / order tables. Pure (no
 * network), so it is unit-testable.
 *
 *   node --experimental-strip-types scripts/etl-domain.ts ./firestore-dump > domain.sql
 *   wrangler d1 execute flea-market --file=domain.sql --remote   # after user ETL
 *
 * Run AFTER the user ETL (orders/stores reference user.id). Firestore order docs
 * were denormalized (User+Store+Item flattened), so shipping + item name are
 * snapshotted onto the order. Loads with foreign_keys OFF so historical orders
 * that reference now-deleted items still import (dangling refs are reported).
 */
import { readFileSync } from 'node:fs';

type Row = Record<string, unknown>;

function readJsonl(path: string): Row[] {
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .map((l) => JSON.parse(l) as Row);
}

function str(v: unknown): string {
  if (v == null || v === '') return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

// Mirrors @nemtus/storage's firebaseDownloadUrlToKey (inlined to keep this Node
// script free of the Workers-typed package).
function firebaseUrlToKey(url: string): string | null {
  const m = /\/o\/([^?]+)/.exec(url);
  if (!m || !m[1]) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

/** Rewrite a Firebase Storage download URL to the R2-served /api/files/<key> path. */
function imageStr(v: unknown): string {
  if (typeof v !== 'string' || v === '') return 'NULL';
  const key = firebaseUrlToKey(v);
  return key ? str(`/api/files/${key}`) : str(v);
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function secs(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? Math.floor(n / 1000) : Math.floor(Date.now() / 1000);
}

// legacy orderStatus → new paymentStatus
function paymentStatus(orderStatus: unknown): 'PENDING' | 'PAID' | 'FAILED' {
  switch (orderStatus) {
    case 'CONFIRMED':
    case 'SENT':
      return 'PAID';
    case 'TIMEOUT':
    case 'ABORTED':
      return 'FAILED';
    default:
      return 'PENDING'; // WAITING_PRICE_INFO / PENDING / UNCONFIRMED / missing
  }
}

function main(): void {
  const dir = process.argv[2];
  if (!dir) {
    console.error('usage: etl-domain <dump-dir>  > domain.sql   (dir has stores/items/orders.jsonl)');
    process.exit(1);
  }

  const stores = readJsonl(`${dir}/stores.jsonl`);
  const items = readJsonl(`${dir}/items.jsonl`);
  const orders = readJsonl(`${dir}/orders.jsonl`);

  const knownItemIds = new Set(items.map((i) => String(i.id)));
  const out: string[] = ['PRAGMA foreign_keys=OFF;'];

  for (const s of stores) {
    const c = secs(s.createdAt);
    const u = secs(s.updatedAt);
    out.push(
      'INSERT OR IGNORE INTO flea_market_store ' +
        '(id,owner_user_id,name,email,phone_number,zip_code,address1,address2,url,' +
        'description,symbol_address,image_url,cover_image_url,created_at,updated_at) VALUES (' +
        `${str(s.id)},${str(s.id)},${str(s.storeName)},${str(s.storeEmail)},` +
        `${str(s.storePhoneNumber)},${str(s.storeZipCode)},${str(s.storeAddress1)},` +
        `${str(s.storeAddress2)},${str(s.storeUrl)},${str(s.storeDescription)},` +
        `${str(s.storeSymbolAddress)},${imageStr(s.storeImageFile)},${imageStr(s.storeCoverImageFile)},` +
        `${c},${u});`,
    );
  }

  for (const i of items) {
    const c = secs(i.createdAt);
    const u = secs(i.updatedAt);
    const status = i.itemStatus === 'ON_SALE' ? 'ON_SALE' : 'SOLD_OUT';
    out.push(
      'INSERT OR IGNORE INTO flea_market_item ' +
        '(id,store_id,name,price_jpy,price_unit,description,image_url,status,created_at,updated_at) VALUES (' +
        `${str(i.id)},${str(i.storeId)},${str(i.itemName)},${num(i.itemPrice)},` +
        `${str(i.itemPriceUnit ?? 'JPY')},${str(i.itemDescription)},${imageStr(i.itemImageFile)},` +
        `${str(status)},${c},${u});`,
    );
  }

  let dangling = 0;
  for (const o of orders) {
    const c = secs(o.createdAt);
    const u = secs(o.updatedAt);
    const qty = Math.max(1, Math.floor(num(o.orderAmount, 1)));
    const total = num(o.orderTotalPrice, num(o.itemPrice) * qty);
    if (!knownItemIds.has(String(o.itemId))) dangling += 1;
    out.push(
      'INSERT OR IGNORE INTO flea_market_order ' +
        '(id,buyer_user_id,store_id,item_id,item_name_snapshot,quantity,total_jpy,' +
        'payment_status,legacy_symbol_tx_hash,ship_name,ship_phone,ship_zip,' +
        'ship_address1,ship_address2,created_at,updated_at) VALUES (' +
        `${str(o.id)},${str(o.buyerUserId)},${str(o.storeId)},${str(o.itemId)},` +
        `${str(o.itemName)},${qty},${total},${str(paymentStatus(o.orderStatus))},` +
        `${str(o.orderTxHash)},${str(o.name)},${str(o.phoneNumber)},${str(o.zipCode)},` +
        `${str(o.address1)},${str(o.address2)},${c},${u});`,
    );
  }

  out.push('PRAGMA foreign_keys=ON;');
  process.stdout.write(`${out.join('\n')}\n`);
  console.error(
    `-- ${stores.length} stores, ${items.length} items, ${orders.length} orders` +
      (dangling ? ` (WARNING: ${dangling} orders reference unknown item ids)` : ''),
  );
}

main();
