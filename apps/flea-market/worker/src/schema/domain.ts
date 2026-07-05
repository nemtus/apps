/**
 * flea-market domain tables for D1 (Drizzle). These collapse the Firestore
 * multi-copy model (private/public + buyer/store copies kept in sync by Cloud
 * Functions) into normalized relational tables — the "views" become joins.
 *
 * Field names mirror the Firestore docs (see StoreCard/ItemCard/OrderCard types):
 *  - store.id === owner userId (one store per user; rules enforce it)
 *  - Firestore stored NO timestamps; created_at/updated_at come from the document
 *    createTime/updateTime metadata captured at dump time.
 *  - Orders were denormalized (User+Store+Item flattened); we normalize to refs
 *    but snapshot the buyer shipping fields + item name + legacy XYM tx hash so
 *    historical orders stay faithful.
 */
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from '@nemtus/db/schema';

/**
 * Per-user flea-market data — the fields the Firestore `users/{uid}` doc held
 * (buyer shipping contact + legacy Symbol address) PLUS the KYC flags relocated
 * off the shared core `user` table (which stays app-agnostic under the one-account
 * NEMTUS identity). One row per user, sharing the user id as PK.
 */
export const userProfile = sqliteTable('flea_market_user_profile', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  phoneNumber: text('phone_number'),
  zipCode: text('zip_code'),
  address1: text('address1'),
  address2: text('address2'),
  /** legacy Symbol address from the buyer profile (kept for reference). */
  symbolAddress: text('symbol_address'),
  // flea-market KYC flags (mirrored from the old Firebase custom claims).
  userKycVerified: integer('user_kyc_verified', { mode: 'boolean' }).notNull().default(false),
  storeKycVerified: integer('store_kyc_verified', { mode: 'boolean' }).notNull().default(false),
  storeEmailVerified: integer('store_email_verified', { mode: 'boolean' }).notNull().default(false),
  storePhoneNumberVerified: integer('store_phone_number_verified', { mode: 'boolean' }).notNull().default(false),
  storeAddressVerified: integer('store_address_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const store = sqliteTable('flea_market_store', {
  id: text('id').primaryKey(), // === owner userId (one store per user)
  ownerUserId: text('owner_user_id')
    .notNull()
    .unique() // enforce one store per user (store.id === ownerUserId invariant)
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // storeName
  email: text('email'),
  phoneNumber: text('phone_number'),
  zipCode: text('zip_code'),
  address1: text('address1'),
  address2: text('address2'),
  url: text('url'),
  description: text('description'),
  /** legacy Symbol payout address (kept for reference; payments move to Stripe) */
  symbolAddress: text('symbol_address'),
  imageUrl: text('image_url'), // storeImageFile (download URL)
  coverImageUrl: text('cover_image_url'), // storeCoverImageFile
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type ItemStatus = 'ON_SALE' | 'SOLD_OUT';

export const item = sqliteTable('flea_market_item', {
  id: text('id').primaryKey(),
  storeId: text('store_id')
    .notNull()
    .references(() => store.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // itemName
  /** price in JPY (zero-decimal; yen) — itemPrice */
  priceJpy: integer('price_jpy').notNull(),
  priceUnit: text('price_unit').notNull().default('JPY'), // itemPriceUnit
  description: text('description'),
  imageUrl: text('image_url'), // itemImageFile (download URL)
  status: text('status').notNull().$type<ItemStatus>().default('SOLD_OUT'), // itemStatus
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export const order = sqliteTable('flea_market_order', {
  id: text('id').primaryKey(),
  // Orders are retained even if the buyer/store is removed, so late Stripe
  // completed/refunded events can still reconcile (no onDelete: 'cascade').
  buyerUserId: text('buyer_user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  storeId: text('store_id')
    .notNull()
    .references(() => store.id, { onDelete: 'restrict' }),
  itemId: text('item_id')
    .notNull()
    .references(() => item.id, { onDelete: 'restrict' }),
  itemNameSnapshot: text('item_name_snapshot'), // item name at order time
  quantity: integer('quantity').notNull().default(1), // orderAmount
  /** total charged in JPY (yen) — orderTotalPrice */
  totalJpy: integer('total_jpy').notNull(),
  paymentStatus: text('payment_status').notNull().$type<OrderPaymentStatus>().default('PENDING'),
  // Unique so a single Stripe event can only ever match one order row.
  stripeSessionId: text('stripe_session_id').unique(),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  /** legacy Symbol tx hash for orders settled on-chain before the Stripe cutover */
  legacySymbolTxHash: text('legacy_symbol_tx_hash'),
  // shipping snapshot (from the denormalized Firestore order doc / buyer profile)
  shipName: text('ship_name'),
  shipPhone: text('ship_phone'),
  shipZip: text('ship_zip'),
  shipAddress1: text('ship_address1'),
  shipAddress2: text('ship_address2'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
