'use client';

import { useState } from 'react';

type Plan = {
  id: 'standard_monthly' | 'standard_yearly' | 'premium_monthly';
  name: string;
  price: string;
  description: string;
};

const plans: Plan[] = [
  { id: 'standard_monthly', name: 'Standard', price: '$9/month', description: 'Forum posting, schematic downloads, and repair resources.' },
  { id: 'standard_yearly', name: 'Standard Annual', price: '$99/year', description: 'Annual Standard membership with a discounted rate.' },
  { id: 'premium_monthly', name: 'Premium', price: '$29/month', description: 'Unlimited downloads and priority technician support.' },
];

export default function PricingPage() {
  const [pendingPlan, setPendingPlan] = useState<Plan['id'] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const checkout = async (planId: Plan['id']) => {
    setPendingPlan(planId);
    setMessage(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/payments/stripe/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) {
        setMessage(data.error || 'Checkout is currently unavailable.');
        return;
      }
      window.location.assign(data.checkoutUrl);
    } catch {
      setMessage('Checkout is currently unavailable.');
    } finally {
      setPendingPlan(null);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-slate-900">Membership plans</h1>
        <p className="mt-4 text-slate-600">Prices and entitlements are verified on the server before checkout is created.</p>
      </header>
      {message && <p role="alert" className="mx-auto mt-6 max-w-xl rounded-md bg-amber-50 p-4 text-center text-amber-900">{message}</p>}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{plan.name}</h2>
            <p className="mt-3 text-3xl font-bold text-slate-900">{plan.price}</p>
            <p className="mt-4 min-h-20 text-sm leading-6 text-slate-600">{plan.description}</p>
            <button
              type="button"
              onClick={() => checkout(plan.id)}
              disabled={pendingPlan !== null}
              className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingPlan === plan.id ? 'Opening secure checkout…' : 'Upgrade with card'}
            </button>
          </article>
        ))}
      </section>
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-500">
        Cryptocurrency, PayPal, and Paystack checkout are intentionally unavailable until their provider reconciliation and idempotency controls are independently verified.
      </p>
    </main>
  );
}
