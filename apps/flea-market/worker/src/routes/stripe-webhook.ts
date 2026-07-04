/**
 * Stripe webhook: advance D1 order state from Stripe events (the settlement
 * source of truth, replacing the on-chain WS/REST tx watcher).
 *
 *   POST /api/stripe/webhook   (raw body + `stripe-signature` header)
 */
import { and, eq } from 'drizzle-orm';
import { createStripe, STRIPE_WEBHOOK_EVENTS, verifyWebhook } from '@nemtus/billing';
import type { OrderPaymentStatus } from '../schema/domain';
import { createDb, schema } from '../db';
import type { Env } from '../env';

/**
 * Advance an order's status only from an allowed prior state, so duplicate or
 * out-of-order Stripe events are idempotent (e.g. a replayed `completed` won't
 * revert a `REFUNDED` order, and only a `PAID` order can become `REFUNDED`).
 */
async function setOrderStatus(
  env: Env,
  match: { sessionId?: string | null; paymentIntentId?: string | null },
  from: OrderPaymentStatus,
  to: OrderPaymentStatus,
  paymentIntentId?: string | null,
): Promise<void> {
  const db = createDb(env.DB);
  const set = {
    paymentStatus: to,
    updatedAt: new Date(),
    ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
  };
  const guard = eq(schema.order.paymentStatus, from);
  if (match.sessionId) {
    await db
      .update(schema.order)
      .set(set)
      .where(and(eq(schema.order.stripeSessionId, match.sessionId), guard));
  } else if (match.paymentIntentId) {
    await db
      .update(schema.order)
      .set(set)
      .where(and(eq(schema.order.stripePaymentIntentId, match.paymentIntentId), guard));
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
    case STRIPE_WEBHOOK_EVENTS.checkoutCompleted: {
      const s = event.data.object;
      const paymentIntentId = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id;
      await setOrderStatus(env, { sessionId: s.id }, 'PENDING', 'PAID', paymentIntentId);
      break;
    }
    case STRIPE_WEBHOOK_EVENTS.checkoutAsyncPaymentFailed: {
      const s = event.data.object;
      await setOrderStatus(env, { sessionId: s.id }, 'PENDING', 'FAILED');
      break;
    }
    case STRIPE_WEBHOOK_EVENTS.chargeRefunded: {
      const c = event.data.object;
      const paymentIntentId = typeof c.payment_intent === 'string' ? c.payment_intent : c.payment_intent?.id;
      await setOrderStatus(env, { paymentIntentId }, 'PAID', 'REFUNDED', paymentIntentId);
      break;
    }
    default:
      break;
  }

  return new Response('ok');
}
