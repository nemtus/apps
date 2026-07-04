import { describe, expect, it } from 'vitest';
import { buildSocialProviders, socialProvidersFromEnv } from './providers';

describe('socialProvidersFromEnv', () => {
  it('creates a credential only when both id and secret are present', () => {
    const env = socialProvidersFromEnv({
      GOOGLE_CLIENT_ID: 'gid',
      GOOGLE_CLIENT_SECRET: 'gsecret',
      GITHUB_CLIENT_ID: 'hid', // secret missing → omitted
      TWITTER_CLIENT_SECRET: 'tsecret', // id missing → omitted
    });
    expect(env.google).toEqual({ clientId: 'gid', clientSecret: 'gsecret' });
    expect(env.github).toBeUndefined();
    expect(env.twitter).toBeUndefined();
    expect(env.microsoft).toBeUndefined();
    expect(env.apple).toBeUndefined();
  });
});

describe('buildSocialProviders', () => {
  it('keeps only providers whose creds are complete', () => {
    const out = buildSocialProviders({
      google: { clientId: 'gid', clientSecret: 'gsecret' },
      github: { clientId: 'hid', clientSecret: '' },
      apple: { clientId: '', clientSecret: 'asecret' },
    });
    expect(Object.keys(out)).toEqual(['google']);
    expect(out.google).toEqual({ clientId: 'gid', clientSecret: 'gsecret' });
  });

  it('returns an empty map when nothing is configured', () => {
    expect(buildSocialProviders({})).toEqual({});
  });
});
