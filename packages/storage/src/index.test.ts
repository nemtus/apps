import { describe, expect, it } from 'vitest';
import { assertOwner, firebaseDownloadUrlToKey, isOwnedBy, serveObject } from './index';

describe('firebaseDownloadUrlToKey', () => {
  it('extracts and decodes the object key from a Firebase Storage URL', () => {
    const url =
      'https://firebasestorage.googleapis.com/v0/b/proj.appspot.com/o/users%2Fu1%2Fitems%2Fa.png?alt=media&token=abc';
    expect(firebaseDownloadUrlToKey(url)).toBe('users/u1/items/a.png');
  });

  it('returns null for a non-Firebase URL', () => {
    expect(firebaseDownloadUrlToKey('https://example.com/a.png')).toBeNull();
  });

  it('returns null for malformed percent-encoding', () => {
    expect(firebaseDownloadUrlToKey('https://x/o/%E0%A4%A')).toBeNull();
  });
});

describe('isOwnedBy / assertOwner', () => {
  it("recognizes the owner's own keys", () => {
    expect(isOwnedBy('users/u1', 'u1')).toBe(true);
    expect(isOwnedBy('users/u1/items/a.png', 'u1')).toBe(true);
  });

  it('rejects other users and prefix look-alikes', () => {
    expect(isOwnedBy('users/u2/a.png', 'u1')).toBe(false);
    expect(isOwnedBy('users/u12/a.png', 'u1')).toBe(false); // "u12" must not match owner "u1"
    expect(isOwnedBy('stores/s1/a.png', 'u1')).toBe(false);
  });

  it('assertOwner throws only for non-owners', () => {
    expect(() => assertOwner('users/u1/a.png', 'u1')).not.toThrow();
    expect(() => assertOwner('users/u2/a.png', 'u1')).toThrow(/forbidden/);
  });
});

describe('serveObject', () => {
  it('returns 404 when the object is missing', async () => {
    const bucket = { get: async () => null } as unknown as R2Bucket;
    const res = await serveObject(bucket, 'users/u1/missing.png');
    expect(res.status).toBe(404);
  });

  it('streams the object with etag + metadata when present', async () => {
    const obj = {
      body: 'PNGDATA',
      httpEtag: '"abc123"',
      writeHttpMetadata: (h: Headers) => h.set('content-type', 'image/png'),
    };
    const bucket = { get: async () => obj } as unknown as R2Bucket;
    const res = await serveObject(bucket, 'users/u1/a.png');
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBe('"abc123"');
    expect(res.headers.get('content-type')).toBe('image/png');
  });
});
