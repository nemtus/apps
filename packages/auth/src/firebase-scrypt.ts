/**
 * Verify a Firebase Authentication password hash (Firebase's modified scrypt),
 * implemented for Cloudflare Workers: scrypt via @noble/hashes (pure JS) + AES-256-CTR
 * via WebCrypto. Node's `crypto.scrypt` is unavailable on Workers, so we avoid it.
 *
 * Firebase's algorithm (per `firebase auth:export` `hash_config`):
 *   dk     = scrypt(password, salt || saltSeparator, N=2^memCost, r=rounds, p=1, dkLen=32)
 *   cipher = AES-256-CTR(key = dk, iv = 0)   // 16-byte all-zero counter
 *   hash   = cipher.encrypt(base64decode(signerKey))
 *   ok     = base64(hash) === storedPasswordHash
 *
 * The per-project params (`signerKey`, `saltSeparator`, `rounds`, `memCost`) come from
 * the project's `hash_config`; `passwordHash` + `salt` are per-user (from the export).
 *
 * Verified against the reference `firebase-scrypt` implementation and the canonical
 * Firebase export test vector (see firebase-scrypt.test.ts). Still worth a final smoke
 * test against one real exported row from the project's own `firebase auth:export`.
 */
import { scrypt } from '@noble/hashes/scrypt';

export interface FirebaseHashConfig {
  /** base64 `hash_config.base64_signer_key` */
  signerKey: string;
  /** base64 `hash_config.base64_salt_separator` */
  saltSeparator: string;
  /** `hash_config.rounds` (scrypt block-size r; Firebase default 8) */
  rounds: number;
  /** `hash_config.mem_cost` (scrypt N = 2^memCost; Firebase default 14) */
  memCost: number;
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function firebaseScryptVerify(args: {
  password: string;
  /** base64 per-user password hash */
  passwordHash: string;
  /** base64 per-user salt */
  salt: string;
  config: FirebaseHashConfig;
}): Promise<boolean> {
  const { password, passwordHash, salt, config } = args;
  const saltBytes = b64ToBytes(salt);
  const sepBytes = b64ToBytes(config.saltSeparator);
  const signerKey = b64ToBytes(config.signerKey);

  const saltFull = new Uint8Array(saltBytes.length + sepBytes.length);
  saltFull.set(saltBytes, 0);
  saltFull.set(sepBytes, saltBytes.length);

  const passwordBytes = new TextEncoder().encode(password);
  // Firebase derives a 32-byte AES-256 key from scrypt, then encrypts the signer key
  // under AES-256-CTR with an all-zero 16-byte IV/counter.
  const dk = scrypt(passwordBytes, saltFull, {
    N: 2 ** config.memCost,
    r: config.rounds,
    p: 1,
    dkLen: 32,
  });

  const aesKey = await crypto.subtle.importKey('raw', dk, { name: 'AES-CTR' }, false, ['encrypt']);
  const ctBuf = await crypto.subtle.encrypt(
    { name: 'AES-CTR', counter: new Uint8Array(16), length: 128 },
    aesKey,
    signerKey,
  );

  return timingSafeEqual(bytesToB64(new Uint8Array(ctBuf)), passwordHash);
}

/** Prefix for a migrated Firebase credential stored in `account.password`. */
export const FIREBASE_MARKER = 'firebase-scrypt';

/** Build the `account.password` marker for an imported Firebase credential. */
export function firebaseCredentialMarker(passwordHash: string, salt: string): string {
  return `${FIREBASE_MARKER}$${passwordHash}$${salt}`;
}

/** Parse a marker back into its `{ passwordHash, salt }`, or null if not a Firebase marker. */
export function parseFirebaseMarker(stored: string): { passwordHash: string; salt: string } | null {
  if (!stored.startsWith(`${FIREBASE_MARKER}$`)) return null;
  const parts = stored.split('$');
  if (parts.length !== 3) return null;
  return { passwordHash: parts[1]!, salt: parts[2]! };
}
