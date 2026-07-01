/**
 * Better Auth browser client (React) for the SPA frontends. Mirrors the server
 * plugins that expose client methods (admin).
 */
import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

export function createAuthBrowserClient(baseURL: string) {
  return createAuthClient({ baseURL, plugins: [adminClient()] });
}

export type AuthBrowserClient = ReturnType<typeof createAuthBrowserClient>;
