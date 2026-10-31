/**
 * Better Auth `secondaryStorage` backed by a Cloudflare KV namespace, so sessions
 * and rate-limit counters live at the edge (D1 stays the source of truth for
 * user/account). Wire the KV binding in the app's wrangler.toml.
 *
 * Better Auth 1.7 moved two steps it used to perform itself into this interface:
 * `getAndDelete` (consume a single-use verification value) and `increment`
 * (advance a rate-limit counter). Both are documented upstream as atomic. KV
 * offers no atomic primitive — no compare-and-swap, no counter — so both are
 * implemented here as read-modify-write serialised per key within this isolate
 * (`withKeyLock`). That matches what Better Auth 1.6 did on this same storage:
 * it wrapped `get`/`delete` in an in-process lock and warned that the fallback
 * "cannot coordinate across processes", and it ran rate limiting as a plain
 * `get` -> decide -> `set`. So concurrent requests served by one isolate are
 * ordered correctly, while requests racing across isolates or PoPs can still
 * interleave; a hard, globally atomic guarantee needs a Durable Object rather
 * than KV.
 */

export interface SecondaryStorage {
  get: (key: string) => Promise<string | null>;
  /** Read a key and remove it, so a single-use value is consumed once. */
  getAndDelete: (key: string) => Promise<string | null>;
  /**
   * Increment the counter at `key`, returning the post-increment count. An
   * absent (or logically expired) key starts a fresh window at 1 that runs
   * `ttl` seconds; later increments within that window never extend it.
   */
  increment: (key: string, ttl: number) => Promise<number>;
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

// Cloudflare KV enforces a 60s minimum expirationTtl.
const KV_MIN_TTL_SECONDS = 60;

/** Counter envelope written by `increment`. `exp` is epoch ms. */
interface Counter {
  count: number;
  exp: number;
}

/**
 * Serialise same-key work within this isolate by chaining onto whatever is
 * already in flight for that key. The entry is dropped once the chain drains,
 * so the map holds only keys with work outstanding.
 */
function createKeyLock() {
  const inFlight = new Map<string, Promise<unknown>>();

  return function withKeyLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const previous = inFlight.get(key) ?? Promise.resolve();
    // Run `fn` whether the predecessor resolved or rejected: one caller's
    // failure must not wedge the key for everyone behind it.
    const result = previous.then(fn, fn);
    const settled = result.then(
      () => {},
      () => {},
    );
    inFlight.set(key, settled);
    void settled.then(() => {
      // Drop the entry only if nobody chained onto it in the meantime.
      if (inFlight.get(key) === settled) inFlight.delete(key);
    });
    return result;
  };
}

export function kvSecondaryStorage(kv: KVNamespace): SecondaryStorage {
  const withKeyLock = createKeyLock();

  return {
    async get(key) {
      return kv.get(key);
    },
    async getAndDelete(key) {
      return withKeyLock(key, async () => {
        const value = await kv.get(key);
        if (value !== null) await kv.delete(key);
        return value;
      });
    },
    async increment(key, ttl) {
      return withKeyLock(key, async () => {
        const now = Date.now();
        const windowSeconds = ttl > 0 ? ttl : KV_MIN_TTL_SECONDS;

        let counter: Counter | null = null;
        const raw = await kv.get(key);
        if (raw !== null) {
          try {
            const parsed: unknown = JSON.parse(raw);
            if (
              typeof parsed === 'object' &&
              parsed !== null &&
              typeof (parsed as Counter).count === 'number' &&
              typeof (parsed as Counter).exp === 'number'
            ) {
              counter = parsed as Counter;
            }
          } catch {
            // Unreadable envelope: treat as absent and start a fresh window.
          }
        }

        // `exp` is what bounds the window, not the KV TTL: KV cannot expire a
        // key sooner than 60s, and Better Auth's default window is 10s. Honour
        // the configured window here and leave the TTL as mere cleanup, so a
        // short window is not silently widened to 60s.
        const next: Counter =
          counter && now < counter.exp
            ? { count: counter.count + 1, exp: counter.exp }
            : { count: 1, exp: now + windowSeconds * 1000 };

        const remainingSeconds = Math.ceil((next.exp - now) / 1000);
        await kv.put(key, JSON.stringify(next), {
          expirationTtl: Math.max(remainingSeconds, KV_MIN_TTL_SECONDS),
        });
        return next.count;
      });
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
