/**
 * Better Auth `secondaryStorage` backed by a Cloudflare KV namespace, so sessions
 * and rate-limit counters live at the edge (D1 stays the source of truth for
 * user/account). Wire the KV binding in the app's wrangler.toml.
 */

export interface SecondaryStorage {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

// Cloudflare KV enforces a 60s minimum expirationTtl.
const KV_MIN_TTL_SECONDS = 60;

export function kvSecondaryStorage(kv: KVNamespace): SecondaryStorage {
  return {
    async get(key) {
      return kv.get(key);
    },
    async set(key, value, ttl) {
      if (ttl && ttl > 0) {
        await kv.put(key, value, { expirationTtl: Math.max(ttl, KV_MIN_TTL_SECONDS) });
      } else {
        await kv.put(key, value);
      }
    },
    async delete(key) {
      await kv.delete(key);
    },
  };
}
