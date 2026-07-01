/**
 * Social provider configuration for Better Auth, mirroring the OAuth set the
 * `hackathon` app used on Firebase (Google / Twitter(X) / GitHub / Microsoft /
 * Apple; Yahoo can be added as a generic OIDC provider later). Each provider is
 * only enabled when its client id/secret env pair is present, so an app can turn
 * providers on/off purely via configuration.
 */

export interface OAuthCredential {
  clientId: string;
  clientSecret: string;
}

export interface SocialProviderEnv {
  google?: OAuthCredential;
  github?: OAuthCredential;
  twitter?: OAuthCredential;
  microsoft?: OAuthCredential;
  apple?: OAuthCredential;
}

/** Build the Better Auth `socialProviders` map, omitting providers without creds. */
export function buildSocialProviders(env: SocialProviderEnv): Record<string, OAuthCredential> {
  const out: Record<string, OAuthCredential> = {};
  for (const [key, cred] of Object.entries(env)) {
    if (cred?.clientId && cred?.clientSecret) out[key] = cred;
  }
  return out;
}

/** Read social provider creds from a flat env bag (e.g. Workers `env`). */
export function socialProvidersFromEnv(env: Record<string, string | undefined>): SocialProviderEnv {
  const pair = (id?: string, secret?: string): OAuthCredential | undefined =>
    id && secret ? { clientId: id, clientSecret: secret } : undefined;
  return {
    google: pair(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET),
    github: pair(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET),
    twitter: pair(env.TWITTER_CLIENT_ID, env.TWITTER_CLIENT_SECRET),
    microsoft: pair(env.MICROSOFT_CLIENT_ID, env.MICROSOFT_CLIENT_SECRET),
    apple: pair(env.APPLE_CLIENT_ID, env.APPLE_CLIENT_SECRET),
  };
}
