'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, FileCode2, Files, LogOut, ShieldCheck, UserRound } from 'lucide-react';

type User = { email: string; name?: string | null; username?: string | null };

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

  return (
    <div className="page-shell account-dashboard">
      <section className="dashboard-hero">
        <span className="eyebrow"><ShieldCheck size={14} /> Your Hisah Tech workspace</span>
        <h1>Welcome back, {name}.</h1>
        <p>Your account is ready. As you explore and use the resource library, your relevant activity will appear here—without any synthetic statistics or sample history.</p>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-empty">
          <span className="dashboard-empty__icon"><UserRound size={24} /></span>
          <h2>A fresh, focused workspace.</h2>
          <p>You do not have any activity yet. Start with a resource library, or tell us what you need and help shape what comes next.</p>
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
