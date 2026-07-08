import { describe, expect, it } from 'vitest';
import { toItemJson, toOrderJson, toStoreJson, toUserJson } from './mappers';

// The mappers ARE the drop-in contract with the SPA, so assert exact field names.
describe('toStoreJson', () => {
  it('maps to store-prefixed fields and coalesces null → empty string', () => {
    const row = {
      id: 's1',
      ownerUserId: 'u1',
      name: 'Shop',
      email: null,
      phoneNumber: null,
      zipCode: null,
      address1: null,
      address2: null,
      url: null,
      description: 'desc',
      symbolAddress: null,
      imageUrl: 'https://img',
      coverImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(toStoreJson(row)).toEqual({
      storeId: 's1',
      storeName: 'Shop',
      storeEmail: '',
      storePhoneNumber: '',
      storeZipCode: '',
      storeAddress1: '',
      storeAddress2: '',
      storeUrl: '',
      storeSymbolAddress: '',
      storeDescription: 'desc',
      storeImageFile: 'https://img',
      storeCoverImageFile: '',
    });
  });
});

describe('toItemJson', () => {
  it('maps to item-prefixed fields', () => {
    const row = {
      id: 'i1',
      storeId: 's1',
      name: 'Item',
      priceJpy: 1000,
      priceUnit: 'JPY',
      description: null,
      imageUrl: null,
      status: 'ON_SALE' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(toItemJson(row)).toEqual({
      itemId: 'i1',
      storeId: 's1',
      itemName: 'Item',
      itemPrice: 1000,
      itemPriceUnit: 'JPY',
      itemDescription: '',
      itemImageFile: '',
      itemStatus: 'ON_SALE',
    });
  });
});

describe('toUserJson', () => {
  it('merges the core session user with the profile (incl. KYC from the profile)', () => {
    const out = toUserJson(
      { id: 'u1', email: 'e@x', name: 'N' },
      {
        userId: 'u1',
        phoneNumber: '090',
        zipCode: null,
        address1: 'A',
        address2: null,
        symbolAddress: null,
        userKycVerified: true,
        storeKycVerified: false,
        storeEmailVerified: false,
        storePhoneNumberVerified: false,
        storeAddressVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
    expect(out).toMatchObject({
      userId: 'u1',
      email: 'e@x',
      name: 'N',
      phoneNumber: '090',
      zipCode: '',
      address1: 'A',
      userKycVerified: true,
      storeKycVerified: false,
    });
  });

  it('handles a missing profile (blanks + false flags)', () => {
    expect(toUserJson({ id: 'u1', email: 'e', name: 'n' }, undefined)).toMatchObject({
      phoneNumber: '',
      address1: '',
      symbolAddress: '',
      userKycVerified: false,
    });
  });
});

describe('toOrderJson', () => {
  const baseOrder = {
    id: 'o1',
    buyerUserId: 'u1',
    storeId: 's1',
    itemId: 'i1',
    itemNameSnapshot: 'Snapshot',
    quantity: 2,
    totalJpy: 2000,
    paymentStatus: 'PAID' as const,
    paymentMethod: 'STRIPE' as const,
    orderStatus: null,
    totalPriceCc: null,
    symbolTxHash: null,
    stripeSessionId: null,
    stripePaymentIntentId: null,
    legacySymbolTxHash: null,
    shipName: 'N',
    shipPhone: null,
    shipZip: null,
    shipAddress1: null,
    shipAddress2: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const buyer = { id: 'u1', email: 'b@x', name: 'Buyer' };
  const profile = {
    userId: 'u1',
    phoneNumber: '090',
    zipCode: '1234567',
    address1: 'A1',
    address2: 'A2',
    symbolAddress: 'NBUYER',
    userKycVerified: true,
    storeKycVerified: true,
    storeEmailVerified: true,
    storePhoneNumberVerified: true,
    storeAddressVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const store = {
    id: 's1',
    ownerUserId: 'u1',
    name: 'Store',
    email: null,
    phoneNumber: null,
    zipCode: null,
    address1: null,
    address2: null,
    url: null,
    description: 'D',
    symbolAddress: 'NSTORE',
    imageUrl: 'store.png',
    coverImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const item = {
    id: 'i1',
    storeId: 's1',
    name: 'Item',
    priceJpy: 1000,
    priceUnit: 'JPY',
    description: null,
    imageUrl: 'item.png',
    status: 'ON_SALE' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('maps a Stripe order + denormalized buyer/store/item (OrderCard shape)', () => {
    expect(toOrderJson(baseOrder, buyer, profile, store, item)).toMatchObject({
      orderId: 'o1',
      buyerUserId: 'u1',
      userId: 'u1',
      orderAmount: 2,
      paymentMethod: 'STRIPE',
      paymentStatus: 'PAID',
      totalJpy: 2000,
      orderStatus: undefined,
      shipName: 'N',
      shipPhone: '',
      email: 'b@x',
      symbolAddress: 'NBUYER',
      storeName: 'Store',
      storeSymbolAddress: 'NSTORE',
      itemName: 'Item',
      itemPrice: 1000,
      itemImageFile: 'item.png',
    });
  });

  it('maps a XYM order rail (orderStatus + CC + tx hash)', () => {
    const xym = {
      ...baseOrder,
      paymentMethod: 'XYM' as const,
      orderStatus: 'PENDING' as const,
      totalPriceCc: 5_000_000,
      symbolTxHash: 'ABCDEF',
    };
    expect(toOrderJson(xym, buyer, profile, store, item)).toMatchObject({
      paymentMethod: 'XYM',
      orderStatus: 'PENDING',
      orderTotalPriceCC: 5_000_000,
      orderTotalPriceCCUnit: 'XYM',
      orderTxHash: 'ABCDEF',
    });
  });

  it('falls back to itemNameSnapshot when the item row is missing', () => {
    expect(toOrderJson(baseOrder, buyer, profile, store, undefined)).toMatchObject({
      itemName: 'Snapshot',
      itemPrice: 0,
    });
  });
});
