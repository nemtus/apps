/**
 * Lazy re-hash: after a user with a migrated Firebase credential logs in
 * successfully, upgrade their stored `account.password` to the native scrypt
 * format so the Firebase dependency drops away over time.
 *
 * Wire this into a Better Auth sign-in *after* hook in Phase 2 (the exact hook
 * API depends on the installed better-auth version), passing the authenticated
 * userId and the plaintext password that was just verified.
 */
import { and, eq } from 'drizzle-orm';
import { createDb, schema } from '@nemtus/db';
import { hashPassword, isLegacyFirebaseHash } from './password';

export async function rehashLegacyPassword(
  d1: D1Database,
  userId: string,
  password: string,
): Promise<boolean> {
  const db = createDb(d1);
  const rows = await db
    .select()
    .from(schema.account)
    .where(and(eq(schema.account.userId, userId), eq(schema.account.providerId, 'credential')));

  const acc = rows[0];
  if (!acc?.password || !isLegacyFirebaseHash(acc.password)) return false;

  const fresh = await hashPassword(password);
  await db
    .update(schema.account)
    .set({ password: fresh, updatedAt: new Date() })
    .where(eq(schema.account.id, acc.id));
  return true;
}
