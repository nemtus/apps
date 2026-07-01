/**
 * Better Auth server factory for Cloudflare Workers (D1 + KV) with:
 *  - Drizzle adapter over @nemtus/db (SQLite/D1)
 *  - KV secondary storage for sessions & rate-limiting
 *  - email/password with lazy Firebase-scrypt verification (migrated users keep
 *    their passwords; new/rehashed ones use the native scrypt format)
 *  - social providers (Google/GitHub/Twitter/Microsoft/Apple), account-linking by email
 *  - KYC additionalFields + the admin plugin (replacing Firebase custom claims)
 *  - transactional email (verification / reset) via an injected @nemtus/email sender
 *
 * The exact Better Auth option names should be checked against the installed version;
 * see README for the rehash-on-login wiring TODO.
 */
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { admin } from 'better-auth/plugins';
import { createDb, schema } from '@nemtus/db';
import type { EmailSender } from '@nemtus/email';
import { hashPassword, verifyPassword } from './password';
import { rehashLegacyPassword } from './rehash';
import { kvSecondaryStorage } from './kv-secondary-storage';
import { buildSocialProviders, type SocialProviderEnv } from './providers';
import type { FirebaseHashConfig } from './firebase-scrypt';

const KYC_BOOLEAN_FIELDS = [
  'userKycVerified',
  'storeKycVerified',
  'storeEmailVerified',
  'storePhoneNumberVerified',
  'storeAddressVerified',
] as const;

export interface CreateAuthOptions {
  /** Cloudflare D1 binding (source of truth for user/account). */
  db: D1Database;
  /** Cloudflare KV binding (sessions / rate-limit secondary storage). */
  kv: KVNamespace;
  /** Better Auth signing secret. */
  secret: string;
  /** Public base URL of the auth server, e.g. https://flea-market.nemtus.com. */
  baseURL: string;
  /** Additional allowed origins for CORS/redirects. */
  trustedOrigins?: string[];
  /** OAuth credentials; providers without creds are omitted. */
  socialProviders?: SocialProviderEnv;
  /** Enable email/password (flea-market). */
  emailAndPassword?: boolean;
  /** Firebase hash_config for verifying migrated passwords (lazy re-hash). */
  firebaseHashConfig?: FirebaseHashConfig;
  /** Transactional email sender (AWS SES). */
  email: EmailSender;
  appName?: string;
}

export function createAuth(options: CreateAuthOptions) {
  const {
    db,
    kv,
    secret,
    baseURL,
    trustedOrigins,
    socialProviders,
    emailAndPassword = false,
    firebaseHashConfig,
    email,
    appName = 'nemtus',
  } = options;

  const additionalFields = Object.fromEntries(
    KYC_BOOLEAN_FIELDS.map((name) => [
      name,
      { type: 'boolean' as const, required: false, defaultValue: false, input: false },
    ]),
  );

  return betterAuth({
    appName,
    secret,
    baseURL,
    trustedOrigins,
    database: drizzleAdapter(createDb(db), { provider: 'sqlite', schema }),
    secondaryStorage: kvSecondaryStorage(kv),
    emailAndPassword: emailAndPassword
      ? {
          enabled: true,
          requireEmailVerification: true,
          password: {
            hash: (password: string) => hashPassword(password),
            verify: ({ hash, password }: { hash: string; password: string }) =>
              verifyPassword({ hash, password, firebaseHashConfig }),
          },
          sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
            await email.send({
              to: user.email,
              subject: 'パスワードの再設定',
              text: `パスワードを再設定するには次のリンクを開いてください:\n${url}`,
            });
          },
        }
      : { enabled: false },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
        await email.send({
          to: user.email,
          subject: 'メールアドレスの確認',
          text: `メールアドレスを確認するには次のリンクを開いてください:\n${url}`,
        });
      },
    },
    socialProviders: socialProviders ? buildSocialProviders(socialProviders) : {},
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'github', 'twitter', 'microsoft', 'apple'],
      },
    },
    user: { additionalFields },
    plugins: [admin()],
    // Lazy re-hash: after a successful email/password sign-in, if the stored
    // credential is still a migrated Firebase hash, upgrade it to the native
    // scrypt format. Only wired when Firebase-hash verification is in play.
    hooks:
      emailAndPassword && firebaseHashConfig
        ? {
            after: createAuthMiddleware(async (ctx) => {
              if (ctx.path !== '/sign-in/email') return;
              const newSession = ctx.context.newSession;
              if (!newSession) return;
              const password = (ctx.body as { password?: string } | undefined)?.password;
              if (!password) return;
              await rehashLegacyPassword(db, newSession.user.id, password);
            }),
          }
        : undefined,
  });
}

export type Auth = ReturnType<typeof createAuth>;
