'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, CreditCard, Download, Files, MessageCircle, Users } from 'lucide-react';

type Totals = { users: number; files: number; downloads: number; threads: number; replies: number; orders: number; paidCents: number };
export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [totals, setTotals] = useState<Totals | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { fetch('/api/admin/analytics', { cache: 'no-store' }).then(async (response) => { if (response.status === 401 || response.status === 403) { router.push('/login'); return; } if (!response.ok) throw new Error('Analytics could not be loaded.'); const data = await response.json(); setTotals(data.totals); }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Analytics could not be loaded.')).finally(() => setLoading(false)); }, []);
  const cards = totals ? [{ label: 'Registered users', value: totals.users, icon: Users }, { label: 'Resources', value: totals.files, icon: Files }, { label: 'Downloads', value: totals.downloads, icon: Download }, { label: 'Forum threads', value: totals.threads, icon: MessageCircle }, { label: 'Forum replies', value: totals.replies, icon: MessageCircle }, { label: 'Paid orders', value: totals.orders, icon: CreditCard }, { label: 'Paid revenue', value: `$${(totals.paidCents / 100).toFixed(2)}`, icon: BarChart3 }] : [];
  return <div className="admin-page page-shell"><Link href="/admin" className="admin-back"><ArrowLeft size={15} /> Admin dashboard</Link><div className="admin-page__top"><span className="eyebrow"><BarChart3 size={14} /> Overview</span><h1>Platform analytics</h1><p>Understand how people are using the library, forum, and membership features.</p></div>{error && <div className="form-error" role="alert">{error}</div>}{loading ? <div className="membership-status">Loading analytics…</div> : <section className="analytics-grid">{cards.map(({ label, value, icon: Icon }) => <div className="analytics-card" key={label}><Icon size={18} /><strong>{value}</strong><span>{label}</span></div>)}</section>}</div>;
}
