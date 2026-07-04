import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Integration check for the domain-API data logic that the Drizzle handlers rely
// on (routes/domain.ts): "published store" visibility (owner must be
// store_kyc_verified), buyer profile upsert, and the new user_profile table —
// exercised against a real SQLite engine loaded from the worker's migrations.
const migrationsDir = new URL('../migrations/', import.meta.url);
const MIGRATIONS = ['0000_init_flea_market.sql', '0001_friendly_paladin.sql'].map((f) =>
  readFileSync(fileURLToPath(new URL(f, migrationsDir)), 'utf8'),
);

function db(): DatabaseSync {
  const d = new DatabaseSync(':memory:');
  d.exec('PRAGMA foreign_keys = ON');
  for (const sql of MIGRATIONS) d.exec(sql);
  return d;
}

const t = 1_700_000_000_000;
function seedUser(d: DatabaseSync, id: string, storeKyc: boolean): void {
  d.exec(
    `INSERT INTO user (id, name, email, store_kyc_verified, created_at, updated_at)
     VALUES ('${id}','U','${id}@e.com',${storeKyc ? 1 : 0},${t},${t})`,
  );
}
function seedStore(d: DatabaseSync, ownerId: string): void {
  d.exec(
    `INSERT INTO store (id, owner_user_id, name, created_at, updated_at)
     VALUES ('${ownerId}','${ownerId}','Shop ${ownerId}',${t},${t})`,
  );
}

// mirrors findPublishedStore(): only stores whose owner passed store KYC are public.
function publishedStoreIds(d: DatabaseSync): string[] {
  return d
    .prepare(
      `SELECT store.id AS id FROM store
       JOIN user ON store.owner_user_id = user.id
       WHERE user.store_kyc_verified = 1`,
    )
    .all()
    .map((r) => (r as { id: string }).id);
}

describe('published-store visibility', () => {
  it('lists only stores whose owner is store_kyc_verified', () => {
    const d = db();
    seedUser(d, 'verified', true);
    seedUser(d, 'unverified', false);
    seedStore(d, 'verified');
    seedStore(d, 'unverified');
    expect(publishedStoreIds(d)).toEqual(['verified']);
  });
});

describe('user_profile upsert', () => {
  it('inserts then updates on conflict, preserving created_at', () => {
    const d = db();
    seedUser(d, 'u1', false);
    const upsert = (phone: string, at: number) =>
      d
        .prepare(
          `INSERT INTO user_profile (user_id, phone_number, created_at, updated_at)
           VALUES ('u1', ?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET phone_number = excluded.phone_number, updated_at = excluded.updated_at`,
        )
        .run(phone, at, at);
    upsert('090', 1);
    upsert('080', 2);
    const row = d.prepare(`SELECT phone_number, created_at, updated_at FROM user_profile WHERE user_id='u1'`).get() as {
      phone_number: string;
      created_at: number;
      updated_at: number;
    };
    expect(row.phone_number).toBe('080');
    expect(row.created_at).toBe(1); // untouched by the update
    expect(row.updated_at).toBe(2);
  });

  it('cascades profile deletion when the user is removed', () => {
    const d = db();
    seedUser(d, 'u1', false);
    d.exec(`INSERT INTO user_profile (user_id, created_at, updated_at) VALUES ('u1',1,1)`);
    d.exec(`DELETE FROM user WHERE id='u1'`);
    expect(d.prepare(`SELECT count(*) AS n FROM user_profile`).get()).toEqual({ n: 0 });
  });
});
