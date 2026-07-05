/**
 * JSON shapes returned by the flea-market Worker domain API (`/api/flea-market/*`).
 * These mirror the Worker's `src/lib/mappers.ts` field-for-field, so they are the
 * canonical replacement for the old colocated Firestore document interfaces.
 */

export type ItemStatus = 'ON_SALE' | 'SOLD_OUT';
export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface StoreJson {
  storeId: string;
  storeName: string;
  storeEmail: string;
  storePhoneNumber: string;
  storeZipCode: string;
  storeAddress1: string;
  storeAddress2: string;
  storeUrl: string;
  storeSymbolAddress: string;
  storeDescription: string;
  storeImageFile: string;
  storeCoverImageFile: string;
}

export interface ItemJson {
  itemId: string;
  storeId: string;
  itemName: string;
  itemPrice: number;
  itemPriceUnit: string;
  itemDescription: string;
  itemImageFile: string;
  itemStatus: ItemStatus;
}

export interface UserJson {
  userId: string;
  email: string;
  name: string;
  phoneNumber: string;
  zipCode: string;
  address1: string;
  address2: string;
  symbolAddress: string;
  userKycVerified: boolean;
  storeKycVerified: boolean;
  storeEmailVerified: boolean;
  storePhoneNumberVerified: boolean;
  storeAddressVerified: boolean;
}

export interface OrderJson {
  orderId: string;
  buyerUserId: string;
  storeId: string;
  itemId: string;
  itemName: string;
  orderAmount: number;
  totalJpy: number;
  paymentStatus: OrderPaymentStatus;
  shipName: string;
  shipPhone: string;
  shipZip: string;
  shipAddress1: string;
  shipAddress2: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigJson {
  enableCreateUser: boolean;
  enableCreateStore: boolean;
  enableCreateItem: boolean;
  enableCreateOrder: boolean;
}

// ---- request inputs ----

export interface UpdateProfileInput {
  name?: string;
  phoneNumber?: string;
  zipCode?: string;
  address1?: string;
  address2?: string;
  symbolAddress?: string;
}

export interface UpsertStoreInput {
  storeName: string;
  storeEmail?: string;
  storePhoneNumber?: string;
  storeZipCode?: string;
  storeAddress1?: string;
  storeAddress2?: string;
  storeUrl?: string;
  storeSymbolAddress?: string;
  storeDescription?: string;
  storeImageFile?: string;
  storeCoverImageFile?: string;
}

export interface ItemInput {
  itemName: string;
  itemPrice: number;
  itemPriceUnit?: string;
  itemDescription?: string;
  itemImageFile?: string;
  itemStatus?: ItemStatus;
}
