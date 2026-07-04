/**
 * Shared HTTP helpers for the domain API: JSON responses, throwable error
 * responses (caught by the Router), and session/KYC guards. Better Auth's KYC
 * `additionalFields` aren't in its inferred session type, so we widen to
 * `SessionUser` at the boundary.
 */
import { buildAuth } from './build-auth';
import type { RouteContext } from './router';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role?: string | null;
  userKycVerified?: boolean;
  storeKycVerified?: boolean;
  storeEmailVerified?: boolean;
  storePhoneNumberVerified?: boolean;
  storeAddressVerified?: boolean;
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

/** Require an authenticated, KYC-verified buyer. */
export async function requireKycUser(ctx: RouteContext): Promise<SessionUser> {
  const user = await requireUser(ctx);
  if (!user.userKycVerified) throw httpError('kyc_required', 403);
  return user;
}

/** Parse a JSON body, throwing a 400 on malformed input. */
export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw httpError('invalid_json', 400);
  }
}
