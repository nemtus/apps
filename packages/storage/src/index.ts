/**
 * Cloudflare R2 helpers over a Workers R2 binding, replacing Firebase Storage.
 *
 * Object keys keep the Firebase Storage path convention (e.g.
 * `users/<userId>/...`, `stores/<storeId>/items/<itemId>/...`) so keys stay valid
 * after the uid-preserving ETL. The Firebase Storage security rules become
 * Worker-side authorization here (`assertOwner`), driven by the Better Auth session.
 */

export interface PutOptions {
  contentType?: string;
  cacheControl?: string;
}

export async function putObject(
  bucket: R2Bucket,
  key: string,
  body: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob,
  opts: PutOptions = {},
): Promise<R2Object> {
  return bucket.put(key, body, {
    httpMetadata: {
      contentType: opts.contentType,
      cacheControl: opts.cacheControl,
    },
  });
}

export function getObject(bucket: R2Bucket, key: string): Promise<R2ObjectBody | null> {
  return bucket.get(key);
}

export function deleteObject(bucket: R2Bucket, key: string): Promise<void> {
  return bucket.delete(key);
}

export function listObjects(bucket: R2Bucket, prefix: string): Promise<R2Objects> {
  return bucket.list({ prefix });
}

/**
 * Extract the R2/Storage object key from a Firebase Storage download URL, e.g.
 *   https://firebasestorage.googleapis.com/v0/b/<bucket>/o/users%2Fu1%2F...%2Fa.png?alt=media&token=…
 *   → "users/u1/.../a.png"
 * Returns null if the URL isn't a recognizable Firebase Storage `/o/<path>` URL.
 * Used by the Storage → R2 migration to rewrite image references to R2 keys.
 */
export function firebaseDownloadUrlToKey(url: string): string | null {
  const m = /\/o\/([^?]+)/.exec(url);
  if (!m || !m[1]) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

/** True if `key` belongs to `userId` under the `users/<userId>/...` convention. */
export function isOwnedBy(key: string, userId: string): boolean {
  return key === `users/${userId}` || key.startsWith(`users/${userId}/`);
}

/** Throws unless `key` is owned by `userId`. Use before serving/mutating private objects. */
export function assertOwner(key: string, userId: string): void {
  if (!isOwnedBy(key, userId)) {
    throw new Error(`forbidden: ${userId} may not access ${key}`);
  }
}

/** Serve an R2 object as a Response, or 404. Gate with assertOwner for private keys. */
export async function serveObject(bucket: R2Bucket, key: string): Promise<Response> {
  const obj = await bucket.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  return new Response(obj.body, { headers });
}
