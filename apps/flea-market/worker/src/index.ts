/**
 * flea-market auth Worker: mounts Better Auth (@nemtus/auth) on Cloudflare Workers,
 * backed by D1 + KV, with lazy Firebase-password migration and SES email.
 *
 * Routes:
 *   GET  /health          liveness
 *   ANY  /api/auth/*       Better Auth handler (sign-in/up, sessions, OAuth callbacks, ...)
 *
 * Runs alongside the existing Firebase app during coexistence; the SPA is pointed
 * here per-feature as flea-market migrates.
 */
import { createAuth, socialProvidersFromEnv } from '@nemtus/auth';
import { createSesSender } from '@nemtus/email';
import type { Env } from './env';

function buildAuth(env: Env) {
  return createAuth({
    db: env.DB,
    kv: env.SESSION_KV,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.AUTH_BASE_URL,
    trustedOrigins: env.TRUSTED_ORIGINS?.split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    emailAndPassword: true, // flea-market is email/password + KYC
    socialProviders: socialProvidersFromEnv(env as unknown as Record<string, string | undefined>),
    firebaseHashConfig: {
      signerKey: env.FIREBASE_SIGNER_KEY,
      saltSeparator: env.FIREBASE_SALT_SEPARATOR,
      rounds: env.FIREBASE_ROUNDS ? Number(env.FIREBASE_ROUNDS) : 8,
      memCost: env.FIREBASE_MEM_COST ? Number(env.FIREBASE_MEM_COST) : 14,
    },
    email: createSesSender({
      region: env.AWS_REGION,
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      defaultFrom: env.SES_FROM,
    }),
    appName: 'flea-market',
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response('ok', { headers: { 'content-type': 'text/plain' } });
    }

    if (url.pathname.startsWith('/api/auth')) {
      return buildAuth(env).handler(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
