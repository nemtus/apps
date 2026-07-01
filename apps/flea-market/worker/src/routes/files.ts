/**
 * Serve migrated product images from R2 (replaces Firebase Storage download URLs).
 *
 *   GET /api/files/<key>
 *
 * Restricted to image objects (keys containing `/images/`), which are the public
 * store/item product images under `users/<uid>/stores/.../images/...`. Private
 * objects (if any are added later) need an auth-gated variant using assertOwner.
 */
import { serveObject } from '@nemtus/storage';
import type { Env } from '../env';

export async function filesRoute(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const key = decodeURIComponent(url.pathname.replace(/^\/api\/files\//, ''));
  if (!key || !key.includes('/images/')) {
    return new Response('Not found', { status: 404 });
  }
  return serveObject(env.BUCKET, key);
}
