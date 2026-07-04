import { describe, expect, it } from 'vitest';
import { Router } from './router';
import type { Env } from './env';

const env = {} as Env;
const execCtx = { waitUntil() {}, passThroughOnException() {} } as unknown as ExecutionContext;
const req = (method: string, path: string) => new Request(`https://x${path}`, { method });

describe('Router', () => {
  it('matches param routes and extracts (decoded) params', async () => {
    const r = new Router();
    r.get('/api/stores/:storeId/items/:itemId', (c) => new Response(JSON.stringify(c.params)));
    const res = await r.handle(req('GET', '/api/stores/s1/items/i%202'), env, execCtx);
    expect(res).not.toBeNull();
    expect(await res!.json()).toEqual({ storeId: 's1', itemId: 'i 2' });
  });

  it('returns null when no path matches, so the caller can fall through', async () => {
    const r = new Router();
    r.get('/api/config', () => new Response('ok'));
    expect(await r.handle(req('GET', '/nope'), env, execCtx)).toBeNull();
  });

  it('returns 405 when the path matches but the method does not', async () => {
    const r = new Router();
    r.get('/api/config', () => new Response('ok'));
    const res = await r.handle(req('POST', '/api/config'), env, execCtx);
    expect(res!.status).toBe(405);
  });

  it('treats a trailing slash as optional', async () => {
    const r = new Router();
    r.get('/api/stores', () => new Response('ok'));
    expect((await r.handle(req('GET', '/api/stores/'), env, execCtx))!.status).toBe(200);
  });

  it('does not let a param segment swallow extra path segments', async () => {
    const r = new Router();
    r.get('/api/stores/:id', () => new Response('ok'));
    // /api/stores/a/b should NOT match /api/stores/:id
    expect(await r.handle(req('GET', '/api/stores/a/b'), env, execCtx)).toBeNull();
  });

  it('surfaces a thrown Response (guard short-circuit) as the result', async () => {
    const r = new Router();
    r.get('/api/x', () => {
      throw new Response('nope', { status: 403 });
    });
    expect((await r.handle(req('GET', '/api/x'), env, execCtx))!.status).toBe(403);
  });

  it('turns a thrown non-Response into a 500', async () => {
    const r = new Router();
    r.get('/api/x', () => {
      throw new Error('boom');
    });
    expect((await r.handle(req('GET', '/api/x'), env, execCtx))!.status).toBe(500);
  });
});
