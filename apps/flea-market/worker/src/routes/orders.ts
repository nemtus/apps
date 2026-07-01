/**
 * Create an order and a Stripe Checkout session. Replaces the old XYM flow
 * (unsigned transfer + QR + on-chain tx matching) with Stripe.
 *
 *   POST /api/orders   { itemId: string, quantity?: number }
 *   -> 200 { orderId, url }   (url = Stripe Checkout page)
 *
 * Gated on an authenticated, KYC-verified buyer.
 */
import { eq } from 'drizzle-orm';
import { createCheckoutSession, createStripe } from '@nemtus/billing';
import type { Auth } from '@nemtus/auth';
import { createDb, schema } from '../db';
import type { Env } from '../env';

interface CreateOrderBody {
  itemId?: string;
  quantity?: number;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function createOrderRoute(request: Request, env: Env, auth: Auth): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return json({ error: 'unauthorized' }, 401);

  // KYC gate (additionalFields may not be in Better Auth's inferred type).
  const buyer = session.user as { id: string; userKycVerified?: boolean };
  if (!buyer.userKycVerified) return json({ error: 'kyc_required' }, 403);

  const body = (await request.json().catch(() => ({}))) as CreateOrderBody;
  if (!body.itemId) return json({ error: 'itemId required' }, 400);
  const quantity = body.quantity && body.quantity > 0 ? Math.floor(body.quantity) : 1;

  const db = createDb(env.DB);
  const items = await db.select().from(schema.item).where(eq(schema.item.id, body.itemId));
  const it = items[0];
  if (!it || it.status !== 'ON_SALE') return json({ error: 'item_unavailable' }, 404);

  const total = it.priceJpy * quantity;
  const orderId = crypto.randomUUID();
  const now = new Date();

  await db.insert(schema.order).values({
    id: orderId,
    buyerUserId: buyer.id,
    storeId: it.storeId,
    itemId: it.id,
    itemNameSnapshot: it.name,
    quantity,
    totalJpy: total,
    paymentStatus: 'PENDING',
    createdAt: now,
    updatedAt: now,
  });

  const stripe = createStripe(env.STRIPE_SECRET_KEY);
  const checkout = await createCheckoutSession(stripe, {
    orderId,
    name: it.name,
    amount: total, // JPY is zero-decimal
    quantity,
    successUrl: env.CHECKOUT_SUCCESS_URL,
    cancelUrl: env.CHECKOUT_CANCEL_URL,
    customerEmail: (session.user as { email?: string }).email,
  });

  await db
    .update(schema.order)
    .set({ stripeSessionId: checkout.id, updatedAt: new Date() })
    .where(eq(schema.order.id, orderId));

  return json({ orderId, url: checkout.url });
}
