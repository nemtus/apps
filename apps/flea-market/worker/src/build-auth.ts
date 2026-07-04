/**
 * Builds the per-request Better Auth instance (D1 + KV + SES + social + Firebase
 * lazy re-hash). Extracted from index.ts so route handlers can reuse it without a
 * circular import. `ctx.waitUntil` lets verification/reset emails be sent off the
 * response path (see @nemtus/auth `waitUntil`).
 */
import { createAuth, socialProvidersFromEnv } from '@nemtus/auth';
import { createSesSender } from '@nemtus/email';
import type { Env } from './env';

export function buildAuth(env: Env, ctx: ExecutionContext) {
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
    waitUntil: ctx.waitUntil.bind(ctx),
    appName: 'flea-market',
  });
}

export type BuiltAuth = ReturnType<typeof buildAuth>;
