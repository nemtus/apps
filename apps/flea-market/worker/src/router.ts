/**
 * Tiny method + path router for the flea-market domain API. Supports `:param`
 * segments (e.g. `/api/stores/:id/items`). Handlers may throw a `Response` to
 * short-circuit (used by the auth/ownership guards in http.ts); anything else
 * thrown becomes a 500. `handle()` returns `null` when no route matches, so the
 * caller can fall through to other handlers (auth, webhook) / a 404.
 */
import type { Env } from './env';

export interface RouteContext {
  request: Request;
  env: Env;
  execCtx: ExecutionContext;
  url: URL;
  params: Record<string, string>;
}

type Handler = (ctx: RouteContext) => Response | Promise<Response>;

interface Route {
  method: string;
  regex: RegExp;
  keys: string[];
  handler: Handler;
}

function compile(path: string): { regex: RegExp; keys: string[] } {
  const keys: string[] = [];
  const pattern = path
    .split('/')
    .map((seg) => {
      if (seg.startsWith(':')) {
        keys.push(seg.slice(1));
        return '([^/]+)';
      }
      return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { regex: new RegExp(`^${pattern}/?$`), keys };
}

export class Router {
  private routes: Route[] = [];

  add(method: string, path: string, handler: Handler): this {
    const { regex, keys } = compile(path);
    this.routes.push({ method, regex, keys, handler });
    return this;
  }

  get(path: string, handler: Handler): this {
    return this.add('GET', path, handler);
  }
  post(path: string, handler: Handler): this {
    return this.add('POST', path, handler);
  }
  put(path: string, handler: Handler): this {
    return this.add('PUT', path, handler);
  }

  /** Returns a Response if a route matched (or a guard threw one), else null. */
  async handle(request: Request, env: Env, execCtx: ExecutionContext): Promise<Response | null> {
    const url = new URL(request.url);
    let matchedPath = false;
    for (const route of this.routes) {
      const m = route.regex.exec(url.pathname);
      if (!m) continue;
      matchedPath = true;
      if (route.method !== request.method) continue;
      const params: Record<string, string> = {};
      try {
        // Malformed percent-encoding (e.g. an invalid UTF-8 sequence) throws a
        // URIError here — return a clean 400 instead of crashing dispatch.
        route.keys.forEach((k, i) => {
          params[k] = decodeURIComponent(m[i + 1]!);
        });
      } catch {
        return new Response(JSON.stringify({ error: 'bad_request' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }
      try {
        return await route.handler({ request, env, execCtx, url, params });
      } catch (err) {
        if (err instanceof Response) return err;
        console.error('unhandled route error', err);
        return new Response(JSON.stringify({ error: 'internal_error' }), {
          status: 500,
          headers: { 'content-type': 'application/json' },
        });
      }
    }
    // Path exists but method not allowed → 405; otherwise no match.
    return matchedPath
      ? new Response(JSON.stringify({ error: 'method_not_allowed' }), {
          status: 405,
          headers: { 'content-type': 'application/json' },
        })
      : null;
  }
}
