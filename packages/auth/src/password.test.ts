import { describe, expect, it } from 'vitest';
import { firebaseCredentialMarker, type FirebaseHashConfig } from './firebase-scrypt';
import { hashPassword, isLegacyFirebaseHash, verifyPassword } from './password';

describe('native scrypt password hashing', () => {
  it('round-trips a freshly hashed password', async () => {
    const hash = await hashPassword('s3cret-pw');
    expect(hash).toMatch(/^scrypt\$32768\$8\$1\$/);
    expect(await verifyPassword({ hash, password: 's3cret-pw' })).toBe(true);
    expect(await verifyPassword({ hash, password: 'wrong-pw' })).toBe(false);
  });

  it('produces a distinct salt (and therefore hash) each call', async () => {
    expect(await hashPassword('same')).not.toBe(await hashPassword('same'));
  });
});

// Canonical Firebase export test vector (see firebase-scrypt.test.ts).
const FIREBASE_CONFIG: FirebaseHashConfig = {
  signerKey:
    'jxspr8Ki0RYycVU8zykbdLGjFQ3McFUH0uiiTvC8pVMXAn210wjLNmdZJzxUECKbm0QsEmYUSDzZvpjeJ9WmXA==',
  saltSeparator: 'Bw==',
  rounds: 8,
  memCost: 14,
};
const FIREBASE_MARKER = firebaseCredentialMarker(
  'lSrfV15cpx95/sZS2W9c9Kp6i/LVgQNDNC/qzrCnh1SAyZvqmZqAjTdn3aoItz+VHjoZilo78198JAdRuid5lQ==',
  '42xEC+ixf3L2lw==',
);

describe('legacy Firebase credential verification (lazy re-hash entry point)', () => {
  it('verifies a migrated firebase-scrypt marker with the project hash config', async () => {
    expect(
      await verifyPassword({
        hash: FIREBASE_MARKER,
        password: 'user1password',
        firebaseHashConfig: FIREBASE_CONFIG,
      }),
    ).toBe(true);
    expect(
      await verifyPassword({
        hash: FIREBASE_MARKER,
        password: 'wrong-password',
        firebaseHashConfig: FIREBASE_CONFIG,
      }),
    ).toBe(false);
  });

  it('refuses a firebase marker when no hash config is available', async () => {
    expect(await verifyPassword({ hash: FIREBASE_MARKER, password: 'user1password' })).toBe(false);
  });

  it('flags firebase markers as legacy, native scrypt as not', () => {
    expect(isLegacyFirebaseHash(FIREBASE_MARKER)).toBe(true);
    expect(isLegacyFirebaseHash('scrypt$32768$8$1$c2FsdA==$aGFzaA==')).toBe(false);
  });
});
