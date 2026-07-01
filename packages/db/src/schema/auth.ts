/**
 * Better Auth core tables for Cloudflare D1 (SQLite), expressed with Drizzle.
 *
 * Object keys are the Better Auth *model field* names (camelCase) — the Drizzle
 * adapter looks fields up by these keys — while the string arguments are the
 * snake_case SQL column names. Includes the `admin` plugin columns and the
 * project's KYC `additionalFields` (mirrored from the Firebase custom claims:
 * userKycVerified / storeKycVerified / storeEmailVerified / storePhoneNumberVerified
 * / storeAddressVerified).
 *
 * Regenerate/verify against the live auth config with:
 *   npx @better-auth/cli generate
 */
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),

  // admin plugin
  role: text('role'),
  banned: integer('banned', { mode: 'boolean' }),
  banReason: text('ban_reason'),
  banExpires: integer('ban_expires', { mode: 'timestamp' }),

  // KYC additionalFields (from Firebase custom claims)
  userKycVerified: integer('user_kyc_verified', { mode: 'boolean' }).notNull().default(false),
  storeKycVerified: integer('store_kyc_verified', { mode: 'boolean' }).notNull().default(false),
  storeEmailVerified: integer('store_email_verified', { mode: 'boolean' }).notNull().default(false),
  storePhoneNumberVerified: integer('store_phone_number_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  storeAddressVerified: integer('store_address_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  // admin plugin
  impersonatedBy: text('impersonated_by'),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  /**
   * For credential accounts this holds the password hash. During the Firebase →
   * Better Auth migration it may hold a marker of the form
   * `firebase-scrypt$<passwordHash>$<salt>` which packages/auth's custom verify
   * recognizes and lazily re-hashes on the next successful login.
   */
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
