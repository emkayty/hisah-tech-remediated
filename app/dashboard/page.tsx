'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, Crown, FileCode2, Files, LockKeyhole, LogOut, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import { formatMembershipExpiry, membershipHasAccess, type MembershipSnapshot } from '@/lib/membership';

type User = {
  email: string;
  name?: string | null;
  username?: string | null;
  membership: MembershipSnapshot;
};

type Plan = { id: string; name: string; description: string; amount_cents: number; currency: string; duration_days: number; features: string[]; is_active: boolean };

const destinations = [
  { href: '/bios-files', title: 'BIOS library', copy: 'Search trusted firmware resources as they are added.', icon: Files },
  { href: '/schematics', title: 'Schematics', copy: 'Keep technical diagrams within easy reach.', icon: FileCode2 },
  { href: '/repair-guides', title: 'Repair guides', copy: 'Follow practical repair guidance without extra noise.', icon: BookOpen },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState('');
  const [upgradeError, setUpgradeError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await response.json();
        if (!data.user) {
          router.replace('/?auth=login');
          return;
        }
        setUser(data.user);
        if (data.user.membership?.status !== 'active') {
          const plansResponse = await fetch('/api/membership/plans', { cache: 'no-store' });
          if (plansResponse.ok) {
            const plansData = await plansResponse.json();
            setPlans(Array.isArray(plansData.plans) ? plansData.plans : []);
          }
        }
      } catch {
        router.replace('/?auth=login');
      } finally {
        setLoading(false);
      }
    }
    void loadDashboard();
  }, [router]);

  async function startCheckout(planId: string) {
    setCheckoutPlan(planId);
    setUpgradeError('');
    try {
      const response = await fetch('/api/payments/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();
      if (response.status === 401) {
        router.replace('/?auth=login');
        return;
      }
      if (!response.ok) throw new Error(data.error || 'Checkout is not available right now.');
      if (!data.checkoutUrl) throw new Error('Checkout did not return a payment link.');
      window.location.href = data.checkoutUrl;
    } catch (cause) {
      setUpgradeError(cause instanceof Error ? cause.message : 'Checkout is not available right now.');
      setCheckoutPlan('');
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/');
    router.refresh();
  }

  if (loading) {
    return <div className="page-shell"><div className="loading-card">Preparing your workspace…</div></div>;
  }
  if (!user) return null;

  const name = user.name || user.username || user.email.split('@')[0];
  const membership = user.membership;
  const expiry = formatMembershipExpiry(membership.expiresAt);
  const hasMemberTools = membershipHasAccess(membership, 'standard');
  const membershipCopy = membership.status === 'active'
    ? expiry ? `Your access is active until ${expiry}.` : 'Your membership is active.'
    : membership.status === 'expired'
      ? 'Renew your membership to restore member-only access.'
      : 'You currently have free access. Upgrade whenever you need more support.';

  return (
    <div className="page-shell account-dashboard">
      <section className="dashboard-hero">
        <span className="eyebrow"><ShieldCheck size={14} /> Your Hisah Tech workspace</span>
        <h1>Welcome back, {name}.</h1>
        <p>Your dashboard reflects your account and membership automatically, so you can see what is available before you start.</p>
      </section>

      <section className={`membership-card membership-card--${membership.status}`} aria-label="Current membership">
        <div className="membership-card__icon"><Crown size={22} /></div>
        <div className="membership-card__body">
          <span className="eyebrow">Current membership</span>
          <div className="membership-card__title-row">
            <h2>{membership.label}</h2>
            <span className={`membership-badge membership-badge--${membership.status}`}>
              {membership.status === 'active' ? 'Active' : membership.status === 'expired' ? 'Expired' : 'Free'}
            </span>
          </div>
          <p>{membershipCopy}</p>
        </div>
        <div className="membership-card__actions">
          {membership.status === 'active' ? <Link href="/pricing" className="button button--outline">Manage membership <ArrowRight size={15} /></Link> : <a href="#upgrade" className="button button--primary">View upgrade options <ArrowRight size={15} /></a>}
        </div>
      </section>

      <section className="dashboard-access" aria-labelledby="access-heading">
        <div className="section-heading"><span className="eyebrow">Membership access</span><h2 id="access-heading">Tools available to your level.</h2></div>
        <div className="dashboard-access__grid">
          <article className={`access-card ${hasMemberTools ? 'access-card--enabled' : 'access-card--locked'}`}>
            <span className="access-card__icon">{hasMemberTools ? <Sparkles size={20} /> : <LockKeyhole size={20} />}</span>
            <div><h3>AI repair assistant</h3><p>{hasMemberTools ? 'Ask focused troubleshooting questions while you work.' : 'Available with an active Standard or Premium membership.'}</p></div>
            {!hasMemberTools && <a href="#upgrade" className="access-card__action">Unlock with membership <ArrowRight size={14} /></a>}
          </article>
          <article className="access-card access-card--enabled">
            <span className="access-card__icon"><Files size={20} /></span>
            <div><h3>Public repair library</h3><p>BIOS files, schematics, and repair guides remain available to every account.</p></div>
            <Link href="/bios-files" className="access-card__action">Browse resources <ArrowRight size={14} /></Link>
          </article>
        </div>
      </section>

      {!hasMemberTools && <section className="dashboard-upgrade" id="upgrade" aria-labelledby="upgrade-heading">
        <div className="section-heading"><span className="eyebrow"><Crown size={14} /> Upgrade your access</span><h2 id="upgrade-heading">Choose a membership and continue from your dashboard.</h2><p>{membership.status === 'expired' ? 'Your previous access has ended. Choose a plan to restore member tools.' : 'Unlock the AI repair assistant and other member benefits with a secure checkout.'}</p></div>
        {upgradeError && <div className="form-error" role="alert">{upgradeError}</div>}
        <div className="dashboard-upgrade__plans">
          {plans.slice(0, 2).map((plan) => <article className="upgrade-plan" key={plan.id}><span className="eyebrow">{plan.duration_days > 31 ? 'Annual access' : 'Monthly access'}</span><h3>{plan.name}</h3><p>{plan.description}</p><strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: plan.currency.toUpperCase(), maximumFractionDigits: 0 }).format(plan.amount_cents / 100)} <small>/{plan.duration_days > 31 ? 'year' : 'month'}</small></strong><button type="button" className="button button--primary" onClick={() => void startCheckout(plan.id)} disabled={checkoutPlan === plan.id}>{checkoutPlan === plan.id ? 'Opening checkout…' : 'Choose this plan'} <ArrowRight size={15} /></button></article>)}
        </div>
        {!plans.length && <p className="membership-status">Membership plans are temporarily unavailable. <Link href="/pricing">Open the full membership page</Link>.</p>}
      </section>}

      <div className="dashboard-grid">
        <section className="dashboard-empty">
          <span className="dashboard-empty__icon"><UserRound size={24} /></span>
          <h2>Your workspace is ready.</h2>
          <p>You have not saved or posted anything yet. Start with a resource, or ask the community about the repair in front of you.</p>
          <div className="empty-state__actions">
            <Link href="/bios-files" className="button button--primary">Explore resources <ArrowRight size={16} /></Link>
            <Link href="/contact" className="button button--outline">Request support</Link>
          </div>
        </section>

        <aside className="account-card">
          <span className="account-card__avatar">{name.slice(0, 1).toUpperCase()}</span>
          <div>
            <span className="eyebrow">Account</span>
            <h2>{name}</h2>
            <p>{user.email}</p>
            {expiry && <p className="account-card__meta"><CalendarDays size={14} /> Access until {expiry}</p>}
          </div>
          <button type="button" className="button button--quiet account-card__logout" onClick={() => void logout()}><LogOut size={16} /> Sign out</button>
        </aside>
      </div>

      <section className="dashboard-destinations">
        <div className="section-heading"><span className="eyebrow">Choose your next step</span><h2>Go directly to the resource you need.</h2></div>
        <div className="resource-grid">
          {destinations.map(({ href, title, copy, icon: Icon }) => (
            <Link href={href} key={href} className="resource-card">
              <span className="resource-card__icon"><Icon size={23} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="resource-card__link">Open {title} <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>
      {hasMemberTools && <AIAssistant />}
    </div>
  );
}
