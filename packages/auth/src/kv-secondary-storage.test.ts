import { afterEach, describe, expect, it, vi } from 'vitest';
import { kvSecondaryStorage } from './kv-secondary-storage';

function mockKv() {
  return {
    get: vi.fn(async () => null),
    put: vi.fn(async () => {}),
    delete: vi.fn(async () => {}),
  };
}

/** A KV double backed by a Map, so read-modify-write paths can be exercised. */
function fakeKv(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    store,
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    delete: vi.fn(async (key: string) => {
      store.delete(key);
    }),
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('kvSecondaryStorage', () => {
  it('clamps a ttl below the 60s KV minimum up to 60', async () => {
    const kv = mockKv();
    await kvSecondaryStorage(kv as unknown as KVNamespace).set('k', 'v', 5);
    expect(kv.put).toHaveBeenCalledWith('k', 'v', { expirationTtl: 60 });
  });

  it('keeps a ttl at or above the minimum', async () => {
    const kv = mockKv();
    await kvSecondaryStorage(kv as unknown as KVNamespace).set('k', 'v', 120);
    expect(kv.put).toHaveBeenCalledWith('k', 'v', { expirationTtl: 120 });
  });

  it('stores without expiry when no ttl is given', async () => {
    const kv = mockKv();
    await kvSecondaryStorage(kv as unknown as KVNamespace).set('k', 'v');
    expect(kv.put).toHaveBeenCalledWith('k', 'v');
  });

  it('delegates get and delete to the namespace', async () => {
    const kv = mockKv();
    const s = kvSecondaryStorage(kv as unknown as KVNamespace);
    await s.get('k');
    await s.delete('k');
    expect(kv.get).toHaveBeenCalledWith('k');
    expect(kv.delete).toHaveBeenCalledWith('k');
  });

  describe('getAndDelete', () => {
    it('returns the value and removes the key', async () => {
      const kv = fakeKv({ 'verification:abc': 'payload' });
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await expect(s.getAndDelete('verification:abc')).resolves.toBe('payload');
      expect(kv.store.has('verification:abc')).toBe(false);
    });

    it('does not issue a delete for an absent key', async () => {
      const kv = fakeKv();
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await expect(s.getAndDelete('missing')).resolves.toBeNull();
      expect(kv.delete).not.toHaveBeenCalled();
    });

    it('hands the value to exactly one of two concurrent consumers', async () => {
      const kv = fakeKv({ k: 'single-use' });
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      const results = await Promise.all([s.getAndDelete('k'), s.getAndDelete('k')]);

      expect(results.filter((r) => r === 'single-use')).toHaveLength(1);
      expect(results.filter((r) => r === null)).toHaveLength(1);
    });

    it('serialises per key without blocking a different key', async () => {
      const kv = fakeKv({ a: '1', b: '2' });
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await expect(Promise.all([s.getAndDelete('a'), s.getAndDelete('b')])).resolves.toEqual([
        '1',
        '2',
      ]);
    });
  });

  describe('increment', () => {
    it('starts a fresh window at 1', async () => {
      const kv = fakeKv();
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await expect(s.increment('rl:ip', 10)).resolves.toBe(1);
    });

    it('counts successive calls within the window', async () => {
      const kv = fakeKv();
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await expect(s.increment('rl:ip', 10)).resolves.toBe(1);
      await expect(s.increment('rl:ip', 10)).resolves.toBe(2);
      await expect(s.increment('rl:ip', 10)).resolves.toBe(3);
    });

    it('counts concurrent calls exactly once each', async () => {
      const kv = fakeKv();
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      const counts = await Promise.all(
        Array.from({ length: 10 }, () => s.increment('rl:burst', 10)),
      );

      expect([...counts].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('does not extend the window on later increments', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
      const kv = fakeKv();
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await s.increment('rl:ip', 30);
      const firstExp = (JSON.parse(kv.store.get('rl:ip') as string) as { exp: number }).exp;

      vi.advanceTimersByTime(10_000);
      await s.increment('rl:ip', 30);
      const secondExp = (JSON.parse(kv.store.get('rl:ip') as string) as { exp: number }).exp;

      expect(secondExp).toBe(firstExp);
    });

    it('restarts the count once the logical window has passed', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
      const kv = fakeKv();
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await expect(s.increment('rl:ip', 10)).resolves.toBe(1);
      // KV cannot expire the key before 60s, so the entry is still readable.
      vi.advanceTimersByTime(11_000);
      await expect(s.increment('rl:ip', 10)).resolves.toBe(1);
    });

    it('keeps a short window short rather than widening it to the KV minimum', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
      const kv = fakeKv();
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await s.increment('rl:ip', 10);

      // The KV TTL is floored at 60s (cleanup only) ...
      expect(kv.put).toHaveBeenCalledWith('rl:ip', expect.any(String), { expirationTtl: 60 });
      // ... while `exp` still bounds the window at the configured 10s.
      const { exp } = JSON.parse(kv.store.get('rl:ip') as string) as { exp: number };
      expect(exp).toBe(Date.now() + 10_000);
    });

    it('starts a fresh window when the stored envelope is unreadable', async () => {
      const kv = fakeKv({ 'rl:ip': 'not json' });
      const s = kvSecondaryStorage(kv as unknown as KVNamespace);

      await expect(s.increment('rl:ip', 10)).resolves.toBe(1);
    });
  });
});
