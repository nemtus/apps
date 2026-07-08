import { afterEach, describe, expect, it, vi } from 'vitest';
import { currencyMosaicAmount, decodeTransferMessage, normalizeMosaicId, verifyXymTransfer } from './symbol';

describe('normalizeMosaicId', () => {
  it('strips 0x / quotes and upper-cases', () => {
    expect(normalizeMosaicId("0x6BED'913F'A202'23F8")).toBe('6BED913FA20223F8');
    expect(normalizeMosaicId('6bed913fa20223f8')).toBe('6BED913FA20223F8');
  });
});

describe('decodeTransferMessage', () => {
  it('decodes a plain (0x00-prefixed) message to its UTF-8 payload', () => {
    // 0x00 + "abc"
    expect(decodeTransferMessage('00616263')).toBe('abc');
  });

  it('round-trips a UUID orderId', () => {
    const orderId = 'b1946ac9-2c8e-4f3a-9a11-abc000111222';
    const hex = `00${[...orderId].map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')}`;
    expect(decodeTransferMessage(hex)).toBe(orderId);
  });

  it('handles empty / missing messages', () => {
    expect(decodeTransferMessage(undefined)).toBe('');
    expect(decodeTransferMessage('')).toBe('');
  });
});

describe('currencyMosaicAmount', () => {
  const currency = '6BED913FA20223F8';
  it('sums only the currency mosaic (as BigInt)', () => {
    const mosaics = [
      { id: "6BED'913F'A202'23F8", amount: '5000000' },
      { id: 'AAAAAAAAAAAAAAAA', amount: '999' },
    ];
    expect(currencyMosaicAmount(mosaics, currency)).toBe(5_000_000n);
  });
  it('returns 0n when the currency mosaic is absent', () => {
    expect(currencyMosaicAmount([{ id: 'AAAA', amount: '1' }], currency)).toBe(0n);
    expect(currencyMosaicAmount(undefined, currency)).toBe(0n);
  });
});

describe('verifyXymTransfer', () => {
  const currency = '6BED913FA20223F8';
  const base = {
    nodeUrl: 'https://node.example:3001',
    storeAddress: 'TSTORE',
    orderId: 'order-1',
    minMicros: 5_000_000n,
    currencyMosaicId: currency,
  };
  const msgHex = (s: string) => `00${[...s].map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')}`;
  const page = (data: unknown[]) => ({ ok: true, status: 200, json: () => Promise.resolve({ data }) }) as Response;

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('confirms a matching transfer (recipient via node, amount, message)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          page([
            {
              meta: { hash: 'abcdef' },
              transaction: { mosaics: [{ id: currency, amount: '5000000' }], message: msgHex('order-1') },
            },
          ]),
        ),
      ),
    );
    expect(await verifyXymTransfer(base)).toEqual({ ok: true, txHash: 'ABCDEF' });
  });

  it('rejects an underpaying transfer', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          page([
            {
              meta: { hash: 'ABCDEF' },
              transaction: { mosaics: [{ id: currency, amount: '4999999' }], message: msgHex('order-1') },
            },
          ]),
        ),
      ),
    );
    expect(await verifyXymTransfer(base)).toEqual({ ok: false, reason: 'insufficient_amount' });
  });

  it('ignores transfers carrying a different orderId (not found)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          page([
            {
              meta: { hash: 'ABCDEF' },
              transaction: { mosaics: [{ id: currency, amount: '5000000' }], message: msgHex('other') },
            },
          ]),
        ),
      ),
    );
    expect(await verifyXymTransfer(base)).toEqual({ ok: false, reason: 'tx_not_found' });
  });

  it('returns tx_not_found when the hash is not among the store transfers', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(page([]))),
    );
    expect(await verifyXymTransfer(base)).toEqual({ ok: false, reason: 'tx_not_found' });
  });

  it('surfaces a node error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 500 } as Response)),
    );
    expect(await verifyXymTransfer(base)).toEqual({ ok: false, reason: 'node_500' });
  });
});
