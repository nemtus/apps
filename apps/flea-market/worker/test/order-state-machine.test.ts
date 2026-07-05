import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Integration check for the Stripe-webhook order state machine. We exercise the same
// guarded UPDATE that src/routes/stripe-webhook.ts issues via Drizzle
// (`SET payment_status = <to> WHERE match AND payment_status = <from>`) against a real
// SQLite engine loaded from the worker's own migration, so idempotency + the FK/unique
// constraints the code relies on are verified, not assumed.
const MIGRATION = readFileSync(fileURLToPath(new URL('../migrations/0000_init.sql', import.meta.url)), 'utf8');

function seedDb(): DatabaseSync {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(MIGRATION);
  const t = 1_700_000_000_000;
  db.exec(`INSERT INTO user (id, name, email, created_at, updated_at) VALUES ('u1','U','u@e.com',${t},${t})`);
  db.exec(
    `INSERT INTO flea_market_store (id, owner_user_id, name, created_at, updated_at) VALUES ('s1','u1','S',${t},${t})`,
  );
  db.exec(
    `INSERT INTO flea_market_item (id, store_id, name, price_jpy, status, created_at, updated_at) VALUES ('i1','s1','Item',1000,'ON_SALE',${t},${t})`,
  );
  return db;
}

function insertOrder(db: DatabaseSync, id: string, sessionId: string): void {
  db.exec(
    `INSERT INTO flea_market_order (id, buyer_user_id, store_id, item_id, total_jpy, payment_status, stripe_session_id, created_at, updated_at)
     VALUES ('${id}','u1','s1','i1',1000,'PENDING','${sessionId}',1,1)`,
  );
}

// mirrors setOrderStatus({ sessionId }, from, to, pi) in stripe-webhook.ts
function advanceBySession(db: DatabaseSync, sessionId: string, from: string, to: string, pi?: string): number {
  return db
    .prepare(
      `UPDATE flea_market_order SET payment_status = ?, stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id)
       WHERE stripe_session_id = ? AND payment_status = ?`,
    )
    .run(to, pi ?? null, sessionId, from).changes as number;
}

// mirrors setOrderStatus({ paymentIntentId }, from, to)
function advanceByPaymentIntent(db: DatabaseSync, pi: string, from: string, to: string): number {
  return db
    .prepare(
      `UPDATE flea_market_order SET payment_status = ? WHERE stripe_payment_intent_id = ? AND payment_status = ?`,
    )
    .run(to, pi, from).changes as number;
}

function statusOf(db: DatabaseSync, id: string): string {
  return (db.prepare(`SELECT payment_status FROM flea_market_order WHERE id = ?`).get(id) as { payment_status: string })
    .payment_status;
}

describe('order payment state machine (guarded, idempotent)', () => {
  it('PENDING → PAID on checkout.session.completed, replays are no-ops', () => {
    const db = seedDb();
    insertOrder(db, 'o1', 'cs_1');
    expect(advanceBySession(db, 'cs_1', 'PENDING', 'PAID', 'pi_1')).toBe(1);
    expect(statusOf(db, 'o1')).toBe('PAID');
    // a replayed completed event guards on PENDING → matches nothing
    expect(advanceBySession(db, 'cs_1', 'PENDING', 'PAID', 'pi_1')).toBe(0);
    expect(statusOf(db, 'o1')).toBe('PAID');
  });

  it('PAID → REFUNDED on charge.refunded, only from PAID and only once', () => {
    const db = seedDb();
    insertOrder(db, 'o1', 'cs_1');
    advanceBySession(db, 'cs_1', 'PENDING', 'PAID', 'pi_1');
    expect(advanceByPaymentIntent(db, 'pi_1', 'PAID', 'REFUNDED')).toBe(1);
    expect(statusOf(db, 'o1')).toBe('REFUNDED');
    expect(advanceByPaymentIntent(db, 'pi_1', 'PAID', 'REFUNDED')).toBe(0);
  });

  it('a FAILED order cannot be resurrected by a late completed event', () => {
    const db = seedDb();
    insertOrder(db, 'o1', 'cs_1');
    expect(advanceBySession(db, 'cs_1', 'PENDING', 'FAILED')).toBe(1);
    expect(advanceBySession(db, 'cs_1', 'PENDING', 'PAID', 'pi_1')).toBe(0);
    expect(statusOf(db, 'o1')).toBe('FAILED');
  });
});

describe('order schema invariants', () => {
  it('enforces a unique stripe_session_id', () => {
    const db = seedDb();
    insertOrder(db, 'o1', 'cs_dup');
    expect(() => insertOrder(db, 'o2', 'cs_dup')).toThrow();
  });

  it('restricts deleting an item an order still references (ON DELETE restrict)', () => {
    const db = seedDb();
    insertOrder(db, 'o1', 'cs_1');
    expect(() => db.exec(`DELETE FROM flea_market_item WHERE id = 'i1'`)).toThrow();
  });
});
