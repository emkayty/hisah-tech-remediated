'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Users } from 'lucide-react';

type User = { id: number; email: string; name?: string | null; username?: string | null; country?: string | null; is_admin: boolean; subscription_plan?: string | null; subscription_expires_at?: string | null; created_at: string };

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { fetch('/api/admin/users', { cache: 'no-store' }).then(async (response) => { if (response.status === 401 || response.status === 403) { router.push('/login'); return; } if (!response.ok) throw new Error('Members could not be loaded.'); const data = await response.json(); setUsers(data.users || []); }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Members could not be loaded.')).finally(() => setLoading(false)); }, []);
  return <div className="admin-page page-shell"><Link href="/admin" className="admin-back"><ArrowLeft size={15} /> Admin dashboard</Link><div className="admin-page__top"><span className="eyebrow"><Users size={14} /> Accounts</span><h1>Members</h1><p>Review registered accounts, roles, and current membership access.</p></div>{error && <div className="form-error" role="alert">{error}</div>}{loading ? <div className="membership-status">Loading members…</div> : <section className="admin-section"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Member</th><th>Location</th><th>Role</th><th>Membership</th><th>Joined</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.name || user.username || 'Unnamed member'}</strong><small>{user.email}</small></td><td>{user.country || 'Not provided'}</td><td>{user.is_admin ? <span className="admin-status"><ShieldCheck size={14} /> Administrator</span> : 'Member'}</td><td>{user.subscription_plan ? <><strong>{user.subscription_plan}</strong><small>{user.subscription_expires_at ? `Until ${new Date(user.subscription_expires_at).toLocaleDateString()}` : 'No expiry'}</small></> : 'Free access'}</td><td>{new Date(user.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>}</div>;
}
