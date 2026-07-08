/**
 * flea-market Worker のドメインAPI（`/api/flea-market/*`）が返す JSON の型。Worker の
 * `src/lib/mappers.ts` とフィールド単位で一致しており、旧来コンポーネントに同居していた
 * Firestore ドキュメント用インターフェースの正規の置き換えとなる。
 */

export type ItemStatus = 'ON_SALE' | 'SOLD_OUT';
export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
/** 決済レール。XYM = オンチェーンSymbol送金、STRIPE = Stripe Checkout。 */
export type PaymentMethod = 'XYM' | 'STRIPE';
/** XYM注文のライフサイクル（旧 Firestore orderStatus 相当）。Stripe注文では undefined。 */
export type OrderStatus =
  | 'WAITING_PRICE_INFO'
  | 'PENDING'
  | 'UNCONFIRMED'
  | 'CONFIRMED'
  | 'SENT'
  | 'TIMEOUT'
  | 'ABORTED';

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

/**
 * デュアルレールかつ非正規化された注文。SPA の OrderCard `Order`（User+Store+Item を継承）に
 * 対応する。XYM注文は orderStatus＋CC/tx 系、Stripe注文は paymentStatus＋totalJpy を持つ。
 * 購入者/店舗/商品は worker 側で結合済み。
 */
export interface OrderJson {
  orderId: string;
  buyerUserId: string;
  userId: string;
  storeId: string;
  itemId: string;
  orderAmount: number;
  paymentMethod: PaymentMethod;
  // Stripe レール
  paymentStatus: OrderPaymentStatus;
  totalJpy: number;
  // XYM レール（Stripe注文では undefined/空）
  orderStatus?: OrderStatus;
  orderTotalPrice: number;
  orderTotalPriceUnit: string;
  orderTotalPriceCC?: number;
  orderTotalPriceCCUnit: string;
  orderTxHash: string;
  // 配送スナップショット
  shipName: string;
  shipPhone: string;
  shipZip: string;
  shipAddress1: string;
  shipAddress2: string;
  // 購入者（非正規化）
  email: string;
  name: string;
  phoneNumber: string;
  zipCode: string;
  address1: string;
  address2: string;
  symbolAddress: string;
  // 店舗（非正規化）
  storeName: string;
  storeDescription: string;
  storeImageFile: string;
  storeSymbolAddress: string;
  // 商品（非正規化）
  itemName: string;
  itemPrice: number;
  itemPriceUnit: string;
  itemDescription: string;
  itemImageFile: string;
  itemStatus: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigJson {
  enableCreateUser: boolean;
  enableCreateStore: boolean;
  enableCreateItem: boolean;
  enableCreateOrder: boolean;
  /** 店舗の電話/住所KYCは既定でスキップ。連携が整い次第 env で有効化する。 */
  enableStorePhoneVerification: boolean;
  enableStoreAddressVerification: boolean;
}

// ---- リクエスト入力 ----

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
