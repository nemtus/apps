/**
 * Password hashing for Better Auth credential accounts (Workers-compatible scrypt).
 *
 * New/rehashed passwords use the self-describing format `scrypt$<N>$<r>$<p>$<saltB64>$<hashB64>`.
 * Verification also transparently accepts migrated Firebase credentials
 * (`firebase-scrypt$<passwordHash>$<salt>`) — this is the "lazy re-hash" entry point:
 * on a successful legacy verify the caller should re-store a fresh `hashPassword()` value
 * (see packages/auth `rehashLegacyPassword` wiring note).
 */
import { scrypt } from '@noble/hashes/scrypt';
import {
  firebaseScryptVerify,
  parseFirebaseMarker,
  type FirebaseHashConfig,
} from './firebase-scrypt';

const N = 2 ** 15;
const R = 8;
const P = 1;
const DK_LEN = 64;

function bytesToB64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

/** Hash a password into the self-describing `scrypt$...` format. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const dk = scrypt(new TextEncoder().encode(password), salt, { N, r: R, p: P, dkLen: DK_LEN });
  return `scrypt$${N}$${R}$${P}$${bytesToB64(salt)}$${bytesToB64(dk)}`;
}

function verifyStandard(stored: string, password: string): boolean {
  const [scheme, n, r, p, saltB64, hashB64] = stored.split('$');
  if (scheme !== 'scrypt' || !n || !r || !p || !saltB64 || !hashB64) return false;
  const dk = scrypt(new TextEncoder().encode(password), b64ToBytes(saltB64), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    dkLen: DK_LEN,
  });
  return constantTimeEqual(dk, b64ToBytes(hashB64));
}

/**
 * Verify a stored credential against a password. Handles both the native
 * `scrypt$...` format and migrated `firebase-scrypt$...` markers (needs the
 * project's Firebase hash_config, supplied by createAuth).
 */
export async function verifyPassword(args: {
  hash: string;
  password: string;
  firebaseHashConfig?: FirebaseHashConfig;
}): Promise<boolean> {
  const { hash, password, firebaseHashConfig } = args;
  const marker = parseFirebaseMarker(hash);
  if (marker) {
    if (!firebaseHashConfig) return false;
    return firebaseScryptVerify({ ...marker, password, config: firebaseHashConfig });
  }
  return verifyStandard(hash, password);
}

/** True if a stored credential is still a migrated Firebase hash (i.e. needs re-hashing). */
export function isLegacyFirebaseHash(stored: string): boolean {
  return parseFirebaseMarker(stored) !== null;
}
