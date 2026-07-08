/**
 * XYM/JPY price for XYM orders — converts an item's JPY price into a XYM amount at
 * order time. Fetches from exchange public APIs with fallbacks (Zaif primary, then
 * bitbank, CoinGecko, and CoinMarketCap when a key is configured) and caches the
 * result briefly in KV to bound rate-limit exposure + latency. Replaces the old
 * scheduled Zaif ticker Cloud Function (priceZaifXymJpyPubSub) with an on-demand
 * fetch.
 *
 * Returns JPY per 1 XYM. The endpoints + response shapes below are the documented
 * ones and are covered by unit tests with mocked responses; they still want a live
 * smoke test against each exchange before go-live.
 */
import type { Env } from '../env';

const CACHE_KEY = 'price:xym_jpy';
const CACHE_TTL_SECONDS = 60;

/** Coerce an exchange field to a positive finite number or throw. */
function toRate(value: unknown): number {
  const n = typeof value === 'string' ? Number(value) : value;
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) {
    throw new Error('invalid_rate');
  }
  return n;
}

// Zaif public API: GET /api/1/ticker/xym_jpy -> { last, ... }
async function fromZaif(): Promise<number> {
  const res = await fetch('https://api.zaif.jp/api/1/ticker/xym_jpy');
  if (!res.ok) throw new Error(`zaif_${res.status}`);
  const body = (await res.json()) as { last?: number };
  return toRate(body.last);
}

// bitbank public API: GET /{pair}/ticker -> { success, data: { last, ... } }
async function fromBitbank(): Promise<number> {
  const res = await fetch('https://public.bitbank.cc/xym_jpy/ticker');
  if (!res.ok) throw new Error(`bitbank_${res.status}`);
  const body = (await res.json()) as { data?: { last?: string } };
  return toRate(body.data?.last);
}

// CoinGecko: GET /api/v3/simple/price?ids=symbol&vs_currencies=jpy -> { symbol: { jpy } }
async function fromCoinGecko(): Promise<number> {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=symbol&vs_currencies=jpy');
  if (!res.ok) throw new Error(`coingecko_${res.status}`);
  const body = (await res.json()) as { symbol?: { jpy?: number } };
  return toRate(body.symbol?.jpy);
}

// CoinMarketCap (key-gated): GET /v2/cryptocurrency/quotes/latest?symbol=XYM&convert=JPY
async function fromCoinMarketCap(env: Env): Promise<number> {
  if (!env.COINMARKETCAP_API_KEY) throw new Error('cmc_no_key');
  const res = await fetch('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=XYM&convert=JPY', {
    headers: { 'X-CMC_PRO_API_KEY': env.COINMARKETCAP_API_KEY },
  });
  if (!res.ok) throw new Error(`cmc_${res.status}`);
  const body = (await res.json()) as {
    data?: { XYM?: Array<{ quote?: { JPY?: { price?: number } } }> };
  };
  return toRate(body.data?.XYM?.[0]?.quote?.JPY?.price);
}

/** Sources tried in order; the first that yields a valid rate wins. */
const SOURCES: Array<(env: Env) => Promise<number>> = [
  () => fromZaif(),
  () => fromBitbank(),
  () => fromCoinGecko(),
  (env) => fromCoinMarketCap(env),
];

/** Fetch XYM/JPY (JPY per 1 XYM), trying each source until one succeeds. */
export async function fetchXymJpyRate(env: Env): Promise<number> {
  for (const source of SOURCES) {
    try {
      return await source(env);
    } catch {
      // fall through to the next source
    }
  }
  throw new Error('xym_jpy_rate_unavailable');
}

/** KV-cached XYM/JPY rate (short TTL). Falls back to a live fetch on cache miss. */
export async function getXymJpyRate(env: Env): Promise<number> {
  const cached = await env.SESSION_KV.get(CACHE_KEY);
  if (cached !== null) {
    const n = Number(cached);
    if (Number.isFinite(n) && n > 0) return n;
  }
  const rate = await fetchXymJpyRate(env);
  await env.SESSION_KV.put(CACHE_KEY, String(rate), { expirationTtl: CACHE_TTL_SECONDS });
  return rate;
}
