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
  it('merges the session user + profile + KYC flags', () => {
    const out = toUserJson(
      { id: 'u1', email: 'e@x', name: 'N', userKycVerified: true },
      {
        userId: 'u1',
        phoneNumber: '090',
        zipCode: null,
        address1: 'A',
        address2: null,
        symbolAddress: null,
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
  it('maps to the normalized (Stripe-era) shape using orderAmount for quantity', () => {
    const row = {
      id: 'o1',
      buyerUserId: 'u1',
      storeId: 's1',
      itemId: 'i1',
      itemNameSnapshot: 'Item',
      quantity: 2,
      totalJpy: 2000,
      paymentStatus: 'PAID' as const,
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
    expect(toOrderJson(row)).toMatchObject({
      orderId: 'o1',
      itemName: 'Item',
      orderAmount: 2,
      totalJpy: 2000,
      paymentStatus: 'PAID',
      shipName: 'N',
      shipPhone: '',
    });
  });
});
