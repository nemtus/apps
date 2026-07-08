import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchXymJpyRate, getXymJpyRate } from './price';
import type { Env } from '../env';

const okJson = (body: unknown) => ({ ok: true, status: 200, json: () => Promise.resolve(body) }) as unknown as Response;
const fail = (status = 500) => ({ ok: false, status, json: () => Promise.resolve({}) }) as unknown as Response;

function stubFetch(byUrl: (url: string) => Response) {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: string | URL) => Promise.resolve(byUrl(String(input)))),
  );
}

const noKeyEnv = { COINMARKETCAP_API_KEY: undefined } as unknown as Env;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('fetchXymJpyRate', () => {
  it('returns the Zaif rate when Zaif succeeds', async () => {
    stubFetch((url) => (url.includes('zaif') ? okJson({ last: 6.1 }) : fail()));
    expect(await fetchXymJpyRate(noKeyEnv)).toBe(6.1);
  });

  it('falls back to bitbank when Zaif fails (parses the string field)', async () => {
    stubFetch((url) => {
      if (url.includes('zaif')) return fail(500);
      if (url.includes('bitbank')) return okJson({ data: { last: '5.5' } });
      return fail();
    });
    expect(await fetchXymJpyRate(noKeyEnv)).toBe(5.5);
  });

  it('skips a source that returns a non-positive rate', async () => {
    stubFetch((url) => {
      if (url.includes('zaif')) return okJson({ last: 0 });
      if (url.includes('bitbank')) return okJson({ data: { last: '7' } });
      return fail();
    });
    expect(await fetchXymJpyRate(noKeyEnv)).toBe(7);
  });

  it('falls through to CoinGecko', async () => {
    stubFetch((url) => (url.includes('coingecko') ? okJson({ symbol: { jpy: 8.2 } }) : fail()));
    expect(await fetchXymJpyRate(noKeyEnv)).toBe(8.2);
  });

  it('uses CoinMarketCap only when a key is set', async () => {
    stubFetch((url) =>
      url.includes('coinmarketcap') ? okJson({ data: { XYM: [{ quote: { JPY: { price: 9.9 } } }] } }) : fail(),
    );
    expect(await fetchXymJpyRate({ COINMARKETCAP_API_KEY: 'k' } as unknown as Env)).toBe(9.9);
    // without a key, CMC is skipped and everything else fails
    await expect(fetchXymJpyRate(noKeyEnv)).rejects.toThrow('xym_jpy_rate_unavailable');
  });

  it('throws when every source fails', async () => {
    stubFetch(() => fail(500));
    await expect(fetchXymJpyRate(noKeyEnv)).rejects.toThrow('xym_jpy_rate_unavailable');
  });
});

describe('getXymJpyRate (KV cache)', () => {
  it('returns the cached rate without fetching', async () => {
    const kv = { get: vi.fn(() => Promise.resolve('5')), put: vi.fn() };
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const rate = await getXymJpyRate({ SESSION_KV: kv } as unknown as Env);
    expect(rate).toBe(5);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(kv.put).not.toHaveBeenCalled();
  });

  it('fetches then caches on a cache miss', async () => {
    const kv = { get: vi.fn(() => Promise.resolve(null)), put: vi.fn(() => Promise.resolve()) };
    stubFetch((url) => (url.includes('zaif') ? okJson({ last: 6 }) : fail()));
    const env = { SESSION_KV: kv, COINMARKETCAP_API_KEY: undefined } as unknown as Env;
    expect(await getXymJpyRate(env)).toBe(6);
    expect(kv.put).toHaveBeenCalledWith('price:xym_jpy', '6', { expirationTtl: 60 });
  });
});
