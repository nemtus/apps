/**
 * Stripe webhook: advance D1 order state from Stripe events (the settlement
 * source of truth, replacing the on-chain WS/REST tx watcher).
 *
 *   POST /api/stripe/webhook   (raw body + `stripe-signature` header)
 */
import { eq } from 'drizzle-orm';
import { createStripe, verifyWebhook } from '@nemtus/billing';
import type { OrderPaymentStatus } from '../schema/domain';
import { createDb, schema } from '../db';
import type { Env } from '../env';

async function setOrderStatus(
  env: Env,
  match: { sessionId?: string | null; paymentIntentId?: string | null },
  status: OrderPaymentStatus,
  paymentIntentId?: string | null,
): Promise<void> {
  const db = createDb(env.DB);
  const set = { paymentStatus: status, updatedAt: new Date(), ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}) };
  if (match.sessionId) {
    await db.update(schema.order).set(set).where(eq(schema.order.stripeSessionId, match.sessionId));
  } else if (match.paymentIntentId) {
    await db
      .update(schema.order)
      .set(set)
      .where(eq(schema.order.stripePaymentIntentId, match.paymentIntentId));
  }
}

export async function stripeWebhookRoute(request: Request, env: Env): Promise<Response> {
  const signature = request.headers.get('stripe-signature');
  if (!signature) return new Response('missing signature', { status: 400 });

  const payload = await request.text();
  const stripe = createStripe(env.STRIPE_SECRET_KEY);

  let event;
  try {
    event = await verifyWebhook(stripe, payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response('invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object;
      const paymentIntentId = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id;
      await setOrderStatus(env, { sessionId: s.id }, 'PAID', paymentIntentId);
      break;
    }
    case 'checkout.session.async_payment_failed': {
      const s = event.data.object;
      await setOrderStatus(env, { sessionId: s.id }, 'FAILED');
      break;
    }
    case 'charge.refunded': {
      const c = event.data.object;
      const paymentIntentId = typeof c.payment_intent === 'string' ? c.payment_intent : c.payment_intent?.id;
      await setOrderStatus(env, { paymentIntentId }, 'REFUNDED', paymentIntentId);
      break;
    }
    default:
      break;
  }

  return new Response('ok');
}
