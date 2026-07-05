/**
 * Shared HTTP helpers for the domain API: JSON responses, throwable error
 * responses (caught by the Router), and the session guard. The session carries
 * only the shared CORE user (id/email/name/role); flea-market KYC lives in
 * flea_market_user_profile, so KYC checks query that table (see routes).
 */
import { buildAuth } from './build-auth';
import type { RouteContext } from './router';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role?: string | null;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** Build a throwable error Response (Router catches thrown Responses). */
export function httpError(message: string, status: number): Response {
  return json({ error: message }, status);
}

/** Resolve the current session user, or throw a 401 Response. */
export async function requireUser(ctx: RouteContext): Promise<SessionUser> {
  const auth = buildAuth(ctx.env, ctx.execCtx);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session) throw httpError('unauthorized', 401);
  return session.user as unknown as SessionUser;
}

/** Parse a JSON body, throwing a 400 on malformed input. */
export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw httpError('invalid_json', 400);
  }
}
