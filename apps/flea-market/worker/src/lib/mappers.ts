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

/**
 * Buyer profile + KYC flags. `user` is the shared core session user (id/email/name);
 * the flea-market shipping fields AND KYC flags come from flea_market_user_profile.
 */
export function toUserJson(user: { id: string; email: string; name: string }, profile: UserProfileRow | undefined) {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    phoneNumber: s(profile?.phoneNumber),
    zipCode: s(profile?.zipCode),
    address1: s(profile?.address1),
    address2: s(profile?.address2),
    symbolAddress: s(profile?.symbolAddress),
    userKycVerified: !!profile?.userKycVerified,
    storeKycVerified: !!profile?.storeKycVerified,
    storeEmailVerified: !!profile?.storeEmailVerified,
    storePhoneNumberVerified: !!profile?.storePhoneNumberVerified,
    storeAddressVerified: !!profile?.storeAddressVerified,
  };
}

type CoreUser = { id: string; email: string; name: string | null };

/**
 * Dual-rail, denormalized order shape matching the SPA's OrderCard `Order`
 * (which extends User + Store + Item). XYM orders carry `orderStatus` + the CC/tx
 * fields; Stripe orders carry `paymentStatus` + `totalJpy`. The buyer / store /
 * item rows are joined in so the buyer's order cards and the store's orders table
 * render without extra round-trips.
 */
export function toOrderJson(
  order: OrderRow,
  buyer: CoreUser | undefined,
  buyerProfile: UserProfileRow | undefined,
  store: StoreRow | undefined,
  item: ItemRow | undefined,
) {
  return {
    orderId: order.id,
    buyerUserId: order.buyerUserId,
    userId: order.buyerUserId,
    storeId: order.storeId,
    itemId: order.itemId,
    orderAmount: order.quantity,
    paymentMethod: order.paymentMethod,
    // Stripe rail
    paymentStatus: order.paymentStatus,
    totalJpy: order.totalJpy,
    // XYM rail (undefined for Stripe orders)
    orderStatus: order.orderStatus ?? undefined,
    orderTotalPrice: order.totalJpy,
    orderTotalPriceUnit: 'JPY',
    orderTotalPriceCC: order.totalPriceCc ?? undefined,
    orderTotalPriceCCUnit: 'XYM',
    orderTxHash: s(order.symbolTxHash),
    // shipping snapshot
    shipName: s(order.shipName),
    shipPhone: s(order.shipPhone),
    shipZip: s(order.shipZip),
    shipAddress1: s(order.shipAddress1),
    shipAddress2: s(order.shipAddress2),
    // buyer (denormalized: OrderCard User fields + the store view's contact columns)
    email: s(buyer?.email),
    name: s(buyer?.name),
    phoneNumber: s(buyerProfile?.phoneNumber),
    zipCode: s(buyerProfile?.zipCode),
    address1: s(buyerProfile?.address1),
    address2: s(buyerProfile?.address2),
    symbolAddress: s(buyerProfile?.symbolAddress),
    // store (denormalized: OrderCard Store fields; storeSymbolAddress is the "to")
    storeName: s(store?.name),
    storeDescription: s(store?.description),
    storeImageFile: s(store?.imageUrl),
    storeSymbolAddress: s(store?.symbolAddress),
    // item (denormalized: OrderCard Item fields)
    itemName: s(item?.name ?? order.itemNameSnapshot),
    itemPrice: item?.priceJpy ?? 0,
    itemPriceUnit: item?.priceUnit ?? 'JPY',
    itemDescription: s(item?.description),
    itemImageFile: s(item?.imageUrl),
    itemStatus: item?.status ?? 'SOLD_OUT',
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
