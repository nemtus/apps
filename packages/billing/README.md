# @nemtus/billing

Stripe billing for Cloudflare Workers — replaces `flea-market`'s XYM order
settlement (transfer + QR + on-chain WS/REST matching + zaif price feed).

```ts
import { createStripe, createCheckoutSession, verifyWebhook } from '@nemtus/billing';

const stripe = createStripe(env.STRIPE_SECRET_KEY);

// checkout:
const session = await createCheckoutSession(stripe, {
  orderId, name: itemName, amount: totalYen,       // JPY is zero-decimal
  successUrl, cancelUrl, customerEmail,
});

// webhook route (raw body!):
const event = await verifyWebhook(stripe, rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
if (event.type === 'checkout.session.completed') { /* mark D1 order PAID via client_reference_id */ }
```

The order status machine collapses from `WAITING_PRICE_INFO → PENDING →
UNCONFIRMED → CONFIRMED` to Stripe-webhook-driven `PENDING → PAID` (`FAILED` /
`REFUNDED`). Store keys as Workers secrets; the webhook needs the **raw** request
body for signature verification.
