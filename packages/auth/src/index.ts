export { createAuth } from './auth';
export type { Auth, CreateAuthOptions } from './auth';
export { createAuthBrowserClient } from './client';
export type { AuthBrowserClient } from './client';
export { hashPassword, verifyPassword, isLegacyFirebaseHash } from './password';
export { rehashLegacyPassword } from './rehash';
export {
  firebaseScryptVerify,
  firebaseCredentialMarker,
  parseFirebaseMarker,
  FIREBASE_MARKER,
} from './firebase-scrypt';
export type { FirebaseHashConfig } from './firebase-scrypt';
export { kvSecondaryStorage } from './kv-secondary-storage';
export type { SecondaryStorage } from './kv-secondary-storage';
export {
  buildSocialProviders,
  socialProvidersFromEnv,
} from './providers';
export type { SocialProviderEnv, OAuthCredential } from './providers';
