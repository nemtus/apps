/**
 * Store KYC is passed when the email step is verified AND every ENABLED extra step
 * (phone / address) is verified. Phone + address are opt-in: when their env flag is
 * off they are skipped (not required), so a store can pass on email alone until the
 * Twilio / postal-mail integrations are switched on.
 */
export function computeStoreKyc(opts: {
  storeEmailVerified: boolean;
  storePhoneNumberVerified: boolean;
  storeAddressVerified: boolean;
  phoneRequired: boolean;
  addressRequired: boolean;
}): boolean {
  return (
    opts.storeEmailVerified &&
    (!opts.phoneRequired || opts.storePhoneNumberVerified) &&
    (!opts.addressRequired || opts.storeAddressVerified)
  );
}
