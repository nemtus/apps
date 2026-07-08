/**
 * Server-side re-verification of an XYM order payment against the Symbol node REST
 * API. Deliberately SDK-free: the @nemtus/symbol-sdk v3 does Ed25519 in a Node/
 * browser WASM module that does not load in the Workers runtime, and verification
 * only needs to parse REST JSON — so we let the NODE match the recipient address
 * (search by recipientAddress) and just check hash + amount + message here. No
 * client-side address (base32) decoding.
 *
 * NOTE: the REST endpoint + response shapes below are the documented ones and are
 * covered by tests with mocked responses; they still want a live smoke test against
 * a real Symbol node before go-live (this is the single most important pre-cutover
 * check for the XYM rail).
 */

/** Symbol transfer transaction type (0x4154). */
const TRANSFER_TYPE = 16724;
const PAGE_SIZE = 100;
const DEFAULT_MAX_PAGES = 3;

interface TransferTxDto {
  transaction?: { mosaics?: Array<{ id: string; amount: string }>; message?: string };
  meta?: { hash?: string };
}

export type VerifyResult = { ok: true; txHash: string } | { ok: false; reason: string };

/** Strip 0x / quotes and upper-case a mosaic id for comparison. */
export function normalizeMosaicId(id: string): string {
  return id.replace(/^0x/i, '').replace(/'/g, '').toUpperCase();
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.length % 2 ? `0${hex}` : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/**
 * Decode a Symbol transfer message (REST hex). Plain messages carry a 0x00 type
 * marker byte followed by the UTF-8 payload; returns the payload string.
 */
export function decodeTransferMessage(messageHex: string | undefined | null): string {
  if (!messageHex) return '';
  const hex = messageHex.replace(/^0x/i, '');
  if (hex.length < 2) return '';
  const bytes = hexToBytes(hex);
  const payload = bytes[0] === 0 ? bytes.subarray(1) : bytes;
  return new TextDecoder().decode(payload);
}

/** Total amount of the given currency mosaic across a transfer's mosaics (micro-units). */
export function currencyMosaicAmount(
  mosaics: Array<{ id: string; amount: string }> | undefined,
  currencyMosaicId: string,
): bigint {
  const want = normalizeMosaicId(currencyMosaicId);
  let sum = 0n;
  for (const m of mosaics ?? []) {
    if (normalizeMosaicId(m.id) === want) sum += BigInt(m.amount);
  }
  return sum;
}

/**
 * Re-verify an XYM payment: `txHash` must be a CONFIRMED transfer TO the store's
 * address, carrying `orderId` as its message and at least `minMicros` of the
 * network currency mosaic. Matches by the **message** (== orderId), so the client
 * needn't find the txHash itself — it just polls and the node matches the recipient
 * for us (no address decoding). Returns the matched transfer's hash.
 */
export async function verifyXymTransfer(opts: {
  nodeUrl: string;
  storeAddress: string;
  orderId: string;
  minMicros: bigint;
  currencyMosaicId: string;
  maxPages?: number;
}): Promise<VerifyResult> {
  const base = opts.nodeUrl.replace(/\/+$/, '');
  const maxPages = opts.maxPages ?? DEFAULT_MAX_PAGES;

  for (let page = 1; page <= maxPages; page += 1) {
    const url =
      `${base}/transactions/confirmed?recipientAddress=${encodeURIComponent(opts.storeAddress)}` +
      `&type=${TRANSFER_TYPE}&order=desc&pageSize=${PAGE_SIZE}&pageNumber=${page}`;
    const res = await fetch(url);
    if (!res.ok) return { ok: false, reason: `node_${res.status}` };
    const body = (await res.json()) as { data?: TransferTxDto[] };
    const data = body.data ?? [];
    for (const tx of data) {
      if (decodeTransferMessage(tx.transaction?.message) !== opts.orderId) continue;
      // Found the confirmed transfer to the store carrying this orderId — check amount.
      const amount = currencyMosaicAmount(tx.transaction?.mosaics, opts.currencyMosaicId);
      if (amount < opts.minMicros) return { ok: false, reason: 'insufficient_amount' };
      return { ok: true, txHash: (tx.meta?.hash ?? '').toUpperCase() };
    }
    if (data.length < PAGE_SIZE) break; // last page reached
  }
  return { ok: false, reason: 'tx_not_found' };
}
