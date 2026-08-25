'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeCheck, Check, ShieldCheck, Sparkles } from 'lucide-react';

type Plan = { id: string; name: string; description: string; amount_cents: number; currency: string; duration_days: number; features: string[]; is_active: boolean };

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/membership/plans', { cache: 'no-store' })
      .then(async (response) => { if (!response.ok) throw new Error('Plans are temporarily unavailable.'); const data = await response.json(); setPlans(data.plans || []); })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Plans are temporarily unavailable.'))
      .finally(() => setLoading(false));
  }, []);

  async function startCheckout(planId: string) {
    setCheckoutPlan(planId);
    setError('');
    try {
      const response = await fetch('/api/payments/stripe/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId }) });
      const data = await response.json();
      if (response.status === 401) { router.push('/login'); return; }
      if (!response.ok) throw new Error(data.error || 'Checkout is not available right now.');
      window.location.href = data.checkoutUrl;
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Checkout is not available right now.'); setCheckoutPlan(''); }
  }

  return (
    <div className="page-shell membership-page">
      <section className="membership-hero">
        <span className="eyebrow"><Sparkles size={14} /> Membership</span>
        <h1>Choose the support that fits your bench.</h1>
        <p>Start with the repair resources and community you need. Plans are shown in plain language, and you will always see the price before payment.</p>
      </section>
      {error && <div className="form-error" role="alert">{error}</div>}
      {loading ? <div className="membership-status">Loading membership options…</div> : plans.length === 0 ? <div className="membership-status">Membership options are not available right now. <Link href="/contact">Contact support</Link></div> : <section className="membership-plans" aria-label="Membership plans">{plans.map((plan, index) => <article className={`membership-plan ${index === 1 ? 'membership-plan--featured' : ''}`} key={plan.id}>{index === 1 && <span className="membership-plan__badge">Best value</span>}<span className="membership-plan__icon"><BadgeCheck size={21} /></span><h2>{plan.name}</h2><p>{plan.description}</p><div className="membership-plan__price"><strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: plan.currency.toUpperCase(), maximumFractionDigits: 0 }).format(plan.amount_cents / 100)}</strong><span>/{plan.duration_days > 31 ? 'year' : 'month'}</span></div><ul>{(Array.isArray(plan.features) ? plan.features : []).map((feature) => <li key={feature}><Check size={15} /> {feature}</li>)}</ul><button type="button" className="button button--primary" onClick={() => startCheckout(plan.id)} disabled={checkoutPlan === plan.id}>{checkoutPlan === plan.id ? 'Opening checkout…' : 'Choose this plan'} <ArrowRight size={16} /></button></article>)}</section>}
      <section className="membership-trust"><div><ShieldCheck size={20} /><strong>Clear pricing</strong><span>No hidden fees or surprise renewals.</span></div><div><BadgeCheck size={20} /><strong>Secure checkout</strong><span>Payment is handled by the configured provider.</span></div><div><Sparkles size={20} /><strong>Useful access</strong><span>Plans unlock practical member benefits, not noise.</span></div></section>
    </div>
  );
}
