/**
 * Better Auth browser client — replaces Firebase Auth. Talks to the shared core
 * `/api/auth/*` on the flea-market Worker (one NEMTUS account across apps). Session
 * cookies are cross-subdomain (`.nemtus.com`) so `useSession()` reflects a login
 * made on any NEMTUS app. KYC/profile fields are NOT on the session — read them via
 * `api.getMe()` (see configs/api.ts).
 */
/* eslint-disable import/no-unresolved -- resolver doesn't follow better-auth's package "exports" subpaths (tsc does) */
import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
/* eslint-enable import/no-unresolved */

// baseURL is the Worker origin; the client appends `/api/auth/*`. Undefined → same
// origin as the SPA. Set REACT_APP_API_BASE_URL when the SPA is served elsewhere.
const baseURL = (import.meta.env.REACT_APP_API_BASE_URL as string | undefined) || undefined;

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
});

export const { useSession, signIn, signUp, signOut, requestPasswordReset, resetPassword, sendVerificationEmail } =
  authClient;
