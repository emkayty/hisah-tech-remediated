'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, Crown, FileCode2, Files, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { formatMembershipExpiry, type MembershipSnapshot } from '@/lib/membership';

type User = {
  email: string;
  name?: string | null;
  username?: string | null;
  membership: MembershipSnapshot;
};

const destinations = [
  { href: '/bios-files', title: 'BIOS library', copy: 'Search trusted firmware resources as they are added.', icon: Files },
  { href: '/schematics', title: 'Schematics', copy: 'Keep technical diagrams within easy reach.', icon: FileCode2 },
  { href: '/repair-guides', title: 'Repair guides', copy: 'Follow practical repair guidance without extra noise.', icon: BookOpen },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await response.json();
        if (!data.user) {
          router.replace('/?auth=login');
          return;
        }
        setUser(data.user);
      } catch {
        router.replace('/?auth=login');
      } finally {
        setLoading(false);
      }
    }
    void loadUser();
  }, [router]);

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
          {membership.status === 'active' ? <Link href="/pricing" className="button button--outline">Manage membership <ArrowRight size={15} /></Link> : <Link href="/pricing" className="button button--primary">View membership plans <ArrowRight size={15} /></Link>}
        </div>
      </section>

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
    </div>
  );
}
