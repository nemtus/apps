# @nemtus/auth

Better Auth for Cloudflare Workers (D1 + KV), shared by the apps.

```ts
import { createAuth } from '@nemtus/auth';
import { createSesSender } from '@nemtus/email';

const auth = createAuth({
  db: env.DB,               // D1
  kv: env.SESSION_KV,       // KV secondary storage (sessions / rate-limit)
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.AUTH_BASE_URL,
  emailAndPassword: true,   // flea-market; hackathon uses socialProviders only
  socialProviders: socialProvidersFromEnv(env),
  firebaseHashConfig: {     // from `firebase auth:export` hash_config (lazy re-hash)
    signerKey: env.FIREBASE_SIGNER_KEY,
    saltSeparator: env.FIREBASE_SALT_SEPARATOR,
    rounds: 8,
    memCost: 14,
  },
  email: createSesSender({ /* ... */ }),
});
// mount auth.handler on your Worker's /api/auth/* route
```

## Firebase → Better Auth migration mechanics

- **Passwords (lazy re-hash).** Imported credential accounts store
  `firebase-scrypt$<passwordHash>$<salt>` in `account.password`.
  `verifyPassword` (wired into `emailAndPassword.password.verify`) detects that
  marker and verifies it with `firebaseScryptVerify` (Workers scrypt + WebCrypto
  AES-CTR). On a successful `/sign-in/email`, `createAuth` runs an **after-hook**
  that calls `rehashLegacyPassword` to upgrade the stored hash to the native
  `scrypt$...` format (only when `emailAndPassword` + `firebaseHashConfig` are set).
- **Identity.** Preserve the Firebase uid as the D1 `user.id` during ETL so
  Firestore/Storage/Symbol references stay valid. OAuth users get one `account`
  row per federated provider; `accountLinking` links by verified email.
- **Claims → roles/fields.** The Firebase `admin` claim maps to the admin plugin
  role; KYC claims map to the `user` `additionalFields`
  (`userKycVerified`, `storeKycVerified`, `storeEmailVerified`,
  `storePhoneNumberVerified`, `storeAddressVerified`).

> ⚠️ Verify `firebaseScryptVerify` against a real exported hash before production —
> Firebase's exact scrypt layout is easy to get subtly wrong.
