import { describe, expect, it } from 'vitest';
import { computeStoreKyc } from './kyc';

describe('computeStoreKyc', () => {
  const email = { storeEmailVerified: true, storePhoneNumberVerified: false, storeAddressVerified: false };

  it('passes on email alone when phone + address are disabled (skipped)', () => {
    expect(computeStoreKyc({ ...email, phoneRequired: false, addressRequired: false })).toBe(true);
  });

  it('fails without email', () => {
    expect(
      computeStoreKyc({
        storeEmailVerified: false,
        storePhoneNumberVerified: true,
        storeAddressVerified: true,
        phoneRequired: false,
        addressRequired: false,
      }),
    ).toBe(false);
  });

  it('requires phone once its flag is on', () => {
    expect(computeStoreKyc({ ...email, phoneRequired: true, addressRequired: false })).toBe(false);
    expect(
      computeStoreKyc({ ...email, storePhoneNumberVerified: true, phoneRequired: true, addressRequired: false }),
    ).toBe(true);
  });

  it('requires address once its flag is on', () => {
    expect(computeStoreKyc({ ...email, phoneRequired: false, addressRequired: true })).toBe(false);
    expect(computeStoreKyc({ ...email, storeAddressVerified: true, phoneRequired: false, addressRequired: true })).toBe(
      true,
    );
  });
});
