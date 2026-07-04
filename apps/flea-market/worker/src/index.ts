/**
 * flea-market backend Worker: Better Auth (@nemtus/auth) on D1 + KV, the Stripe
 * webhook, R2 file serving, and the domain REST API (stores/items/orders/profile
 * + image upload) that replaces Firestore + the Cloud Functions fan-out.
 *
 * Routing: three endpoints need special handling (raw body / wildcard / multi-
 * segment key) and are matched first; everything else goes through the Router
 * (see routes/domain.ts). Runs alongside Firebase during coexistence.
 */
import { buildAuth } from './build-auth';
import type { Env } from './env';
import { filesRoute } from './routes/files';
import { stripeWebhookRoute } from './routes/stripe-webhook';
import { registerDomainRoutes } from './routes/domain';
import { Router } from './router';

const router = new Router();
registerDomainRoutes(router);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response('ok', { headers: { 'content-type': 'text/plain' } });
    }

    // Stripe webhook must bypass auth and read the raw body.
    if (url.pathname === '/api/stripe/webhook' && request.method === 'POST') {
      return stripeWebhookRoute(request, env);
    }

    // Better Auth owns its whole /api/auth/* subtree (sign-in/up, sessions, OAuth).
    if (url.pathname.startsWith('/api/auth')) {
      return buildAuth(env, ctx).handler(request);
    }

    // File keys contain slashes, so they can't be a single `:param` route.
    if (url.pathname.startsWith('/api/files/') && request.method === 'GET') {
      return filesRoute(request, env);
    }

    const routed = await router.handle(request, env, ctx);
    if (routed) return routed;

    return new Response('Not found', { status: 404 });
  },
};
