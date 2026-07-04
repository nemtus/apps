import { describe, expect, it } from 'vitest';
import {
  firebaseCredentialMarker,
  firebaseScryptVerify,
  parseFirebaseMarker,
} from '../src/firebase-scrypt';

// Canonical Firebase Authentication scrypt test vector (Firebase's own example,
// reused across community ports). If this passes, our Workers port
// (@noble/hashes scrypt + WebCrypto AES-CTR) matches real Firebase output.
const CONFIG = {
  signerKey:
    'jxspr8Ki0RYycVU8zykbdLGjFQ3McFUH0uiiTvC8pVMXAn210wjLNmdZJzxUECKbm0QsEmYUSDzZvpjeJ9WmXA==',
  saltSeparator: 'Bw==',
  rounds: 8,
  memCost: 14,
};
const PASSWORD = 'user1password';
const SALT = '42xEC+ixf3L2lw==';
const HASH =
  'lSrfV15cpx95/sZS2W9c9Kp6i/LVgQNDNC/qzrCnh1SAyZvqmZqAjTdn3aoItz+VHjoZilo78198JAdRuid5lQ==';

describe('firebaseScryptVerify (Firebase modified scrypt)', () => {
  it('accepts the correct password for the canonical Firebase test vector', async () => {
    const ok = await firebaseScryptVerify({
      password: PASSWORD,
      passwordHash: HASH,
      salt: SALT,
      config: CONFIG,
    });
    expect(ok).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const ok = await firebaseScryptVerify({
      password: 'not-the-password',
      passwordHash: HASH,
      salt: SALT,
      config: CONFIG,
    });
    expect(ok).toBe(false);
  });
});

describe('firebase marker helpers', () => {
  it('round-trips build ↔ parse', () => {
    const marker = firebaseCredentialMarker(HASH, SALT);
    expect(marker).toBe(`firebase-scrypt$${HASH}$${SALT}`);
    expect(parseFirebaseMarker(marker)).toEqual({ passwordHash: HASH, salt: SALT });
  });

  it('returns null for non-firebase markers', () => {
    expect(parseFirebaseMarker('scrypt$16384$8$1$abc$def')).toBeNull();
    expect(parseFirebaseMarker('plain')).toBeNull();
  });
});
