/**
 * Map normalized D1 rows to the JSON field names the flea-market SPA reads
 * (the Store / Item / User shapes — see the frontend StoreCard, ItemCard,
 * OrderCard interfaces). Firestore stored empty strings rather than nulls, so we coalesce
 * `null` → '' to keep the SPA's required-string fields drop-in.
 */
import type { schema } from '../db';

type StoreRow = typeof schema.store.$inferSelect;
type ItemRow = typeof schema.item.$inferSelect;
type OrderRow = typeof schema.order.$inferSelect;
type UserProfileRow = typeof schema.userProfile.$inferSelect;

const s = (v: string | null | undefined): string => v ?? '';

export function toStoreJson(store: StoreRow) {
  return {
    storeId: store.id,
    storeName: store.name,
    storeEmail: s(store.email),
    storePhoneNumber: s(store.phoneNumber),
    storeZipCode: s(store.zipCode),
    storeAddress1: s(store.address1),
    storeAddress2: s(store.address2),
    storeUrl: s(store.url),
    storeSymbolAddress: s(store.symbolAddress),
    storeDescription: s(store.description),
    storeImageFile: s(store.imageUrl),
    storeCoverImageFile: s(store.coverImageUrl),
  };
}

export function toItemJson(item: ItemRow) {
  return {
    itemId: item.id,
    storeId: item.storeId,
    itemName: item.name,
    itemPrice: item.priceJpy,
    itemPriceUnit: item.priceUnit,
    itemDescription: s(item.description),
    itemImageFile: s(item.imageUrl),
    itemStatus: item.status,
  };
}

/** Buyer profile + KYC flags. `user` is the session user (auth table + KYC). */
export function toUserJson(
  user: {
    id: string;
    email: string;
    name: string;
    userKycVerified?: boolean;
    storeKycVerified?: boolean;
    storeEmailVerified?: boolean;
    storePhoneNumberVerified?: boolean;
    storeAddressVerified?: boolean;
  },
  profile: UserProfileRow | undefined,
) {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    phoneNumber: s(profile?.phoneNumber),
    zipCode: s(profile?.zipCode),
    address1: s(profile?.address1),
    address2: s(profile?.address2),
    symbolAddress: s(profile?.symbolAddress),
    userKycVerified: !!user.userKycVerified,
    storeKycVerified: !!user.storeKycVerified,
    storeEmailVerified: !!user.storeEmailVerified,
    storePhoneNumberVerified: !!user.storePhoneNumberVerified,
    storeAddressVerified: !!user.storeAddressVerified,
  };
}

/**
 * Normalized (Stripe-era) order shape. The XYM-era `orderStatus`/QR/CC fields are
 * gone; the SPA's order pages are rewired to `paymentStatus`. `orderAmount` keeps
 * the frontend's quantity field name.
 */
export function toOrderJson(order: OrderRow) {
  return {
    orderId: order.id,
    buyerUserId: order.buyerUserId,
    storeId: order.storeId,
    itemId: order.itemId,
    itemName: s(order.itemNameSnapshot),
    orderAmount: order.quantity,
    totalJpy: order.totalJpy,
    paymentStatus: order.paymentStatus,
    shipName: s(order.shipName),
    shipPhone: s(order.shipPhone),
    shipZip: s(order.shipZip),
    shipAddress1: s(order.shipAddress1),
    shipAddress2: s(order.shipAddress2),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
