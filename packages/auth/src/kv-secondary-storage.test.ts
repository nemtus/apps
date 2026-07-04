import { describe, expect, it, vi } from 'vitest';
import { kvSecondaryStorage } from './kv-secondary-storage';

function mockKv() {
  return {
    get: vi.fn(async () => null),
    put: vi.fn(async () => {}),
    delete: vi.fn(async () => {}),
  };
}

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
});
