export const PLANS = {
  standard_monthly: {
    id: 'standard_monthly',
    name: 'Standard Monthly',
    amountCents: 900,
    currency: 'usd',
    durationDays: 31,
  },
  standard_yearly: {
    id: 'standard_yearly',
    name: 'Standard Yearly',
    amountCents: 9900,
    currency: 'usd',
    durationDays: 366,
  },
  premium_monthly: {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    amountCents: 2900,
    currency: 'usd',
    durationDays: 31,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function isPlanId(value: string): value is PlanId {
  return Object.prototype.hasOwnProperty.call(PLANS, value);
}
