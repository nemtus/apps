/**
 * flea-market domain tables for D1 (Drizzle). These collapse the Firestore
 * multi-copy model (private/public + buyer/store copies kept in sync by Cloud
 * Functions) into normalized relational tables — the "views" become joins.
 *
 * Ids preserve the Firestore ids so the domain ETL is a straight copy and stays
 * consistent with the uid-preserving user migration (store.id === owner userId,
 * per the original one-store-per-user rule).
 */
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from '@nemtus/db/schema';

export const store = sqliteTable('store', {
  id: text('id').primaryKey(), // === owner userId (one store per user)
  ownerUserId: text('owner_user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  /** legacy Symbol payout address (kept for reference; payments move to Stripe) */
  symbolAddress: text('symbol_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const item = sqliteTable('item', {
  id: text('id').primaryKey(),
  storeId: text('store_id')
    .notNull()
    .references(() => store.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  /** price in JPY (zero-decimal; yen) */
  priceJpy: integer('price_jpy').notNull(),
  imageKey: text('image_key'), // R2 object key
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export const order = sqliteTable('order', {
  id: text('id').primaryKey(),
  buyerUserId: text('buyer_user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  storeId: text('store_id')
    .notNull()
    .references(() => store.id, { onDelete: 'cascade' }),
  itemId: text('item_id')
    .notNull()
    .references(() => item.id, { onDelete: 'restrict' }),
  quantity: integer('quantity').notNull().default(1),
  /** total charged in JPY (yen) */
  totalJpy: integer('total_jpy').notNull(),
  paymentStatus: text('payment_status').notNull().$type<OrderPaymentStatus>().default('PENDING'),
  stripeSessionId: text('stripe_session_id'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
