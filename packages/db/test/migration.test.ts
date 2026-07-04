import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Integration check: the drizzle-generated Better Auth migration must apply cleanly
// to a real SQLite engine (D1 is SQLite) and produce the expected tables/constraints.
const MIGRATION = readFileSync(
  fileURLToPath(new URL('../migrations/0000_init_auth.sql', import.meta.url)),
  'utf8',
);

describe('Better Auth D1 migration', () => {
  it('creates the core auth tables', () => {
    const db = new DatabaseSync(':memory:');
    db.exec(MIGRATION);
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all()
      .map((r) => (r as { name: string }).name);
    expect(tables).toEqual(expect.arrayContaining(['account', 'session', 'user', 'verification']));
  });

  it('applies KYC defaults and enforces a unique email', () => {
    const db = new DatabaseSync(':memory:');
    db.exec('PRAGMA foreign_keys = ON');
    db.exec(MIGRATION);
    const t = 1_700_000_000_000;
    db.exec(
      `INSERT INTO user (id, name, email, created_at, updated_at) VALUES ('u1','U','u@e.com',${t},${t})`,
    );
    const row = db
      .prepare("SELECT email_verified, user_kyc_verified FROM user WHERE id='u1'")
      .get() as { email_verified: number; user_kyc_verified: number };
    expect(row.email_verified).toBe(0);
    expect(row.user_kyc_verified).toBe(0);
    expect(() =>
      db.exec(
        `INSERT INTO user (id,name,email,created_at,updated_at) VALUES ('u2','U2','u@e.com',${t},${t})`,
      ),
    ).toThrow();
  });
});
