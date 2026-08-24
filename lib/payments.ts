import { getDatabase } from '@/lib/db';
import { PLANS, type PlanId } from '@/lib/plans';
import { ApiError } from '@/lib/security';

export async function activateStripeOrder(input: {
  providerEventId: string;
  stripeSessionId: string;
  paymentIntentId: string | null;
  amountTotal: number | null;
  currency: string | null;
}): Promise<void> {
  const database = getDatabase();
  const orders = await database`
    SELECT id, user_id, plan_id, amount_cents, currency, status, provider_reference
    FROM payment_orders
    WHERE provider = 'stripe' AND provider_reference = ${input.stripeSessionId}
    LIMIT 1
  `;
  if (!orders.length) throw new ApiError(404, 'Payment order not found');

  const order = orders[0] as Record<string, unknown>;
  const planId = String(order.plan_id) as PlanId;
  const plan = PLANS[planId];
  if (!plan || Number(order.amount_cents) !== plan.amountCents || String(order.currency).toLowerCase() !== plan.currency) {
    throw new ApiError(409, 'Payment order has an invalid plan contract');
  }
  if (input.amountTotal !== plan.amountCents || input.currency?.toLowerCase() !== plan.currency) {
    throw new ApiError(409, 'Provider payment total does not match the order');
  }

  const alreadyProcessed = await database`
    INSERT INTO payment_events (provider, provider_event_id, processed_at)
    VALUES ('stripe', ${input.providerEventId}, NOW())
    ON CONFLICT (provider, provider_event_id) DO NOTHING
    RETURNING provider_event_id
  `;
  if (!alreadyProcessed.length) return;

  const newExpiry = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();
  await database`
    UPDATE payment_orders
    SET status = 'paid', payment_intent_id = ${input.paymentIntentId}, paid_at = NOW(), updated_at = NOW()
    WHERE id = ${Number(order.id)} AND status = 'pending'
  `;
  await database`
    UPDATE users
    SET subscription_plan = ${planId},
        subscription_expires_at = GREATEST(COALESCE(subscription_expires_at, NOW()), ${newExpiry}::timestamptz),
        updated_at = NOW()
    WHERE id = ${Number(order.user_id)}
  `;
}
