/**
 * Stripe client + helpers for Cloudflare Workers. Uses Stripe's fetch HTTP client
 * and SubtleCrypto provider (no Node APIs). Replaces the XYM transfer + on-chain
 * tx-matching settlement with Stripe Checkout + webhook-driven order confirmation.
 */
import Stripe from 'stripe';
import type { CreateCheckoutParams } from './types';

export function createStripe(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

/** Create a Checkout Session for an order; `client_reference_id` carries our orderId. */
export function createCheckoutSession(
  stripe: Stripe,
  params: CreateCheckoutParams,
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    client_reference_id: params.orderId,
    metadata: { orderId: params.orderId },
    customer_email: params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    line_items: [
      {
        quantity: params.quantity ?? 1,
        price_data: {
          currency: params.currency ?? 'jpy',
          unit_amount: params.amount,
          product_data: { name: params.name },
        },
      },
    ],
  });
}

/**
 * Refund a captured payment by its PaymentIntent id (full refund by default).
 * The resulting `charge.refunded` webhook is what advances the order to REFUNDED.
 */
export function createRefund(
  stripe: Stripe,
  paymentIntentId: string,
  params: { amount?: number } = {},
): Promise<Stripe.Refund> {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(params.amount != null ? { amount: params.amount } : {}),
  });
}

/**
 * Verify a Stripe webhook signature on Workers (must be async — SubtleCrypto).
 * `payload` is the raw request body string.
 */
export function verifyWebhook(
  stripe: Stripe,
  payload: string,
  signature: string,
  webhookSecret: string,
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEventAsync(
    payload,
    signature,
    webhookSecret,
    undefined,
    Stripe.createSubtleCryptoProvider(),
  );
}
