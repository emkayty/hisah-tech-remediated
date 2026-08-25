'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Clock3, CreditCard, History, Save, ShieldCheck, Users } from 'lucide-react';

type Plan = { id: string; name: string; description: string; amount_cents: number; currency: string; duration_days: number; features: string[]; is_active: boolean; display_order: number };
type Member = { id: number; email: string; name?: string | null; username?: string | null; subscription_plan?: string | null; subscription_expires_at?: string | null; created_at: string };
type Activity = { id: number; activity_type: string; plan_id?: string | null; actor_email?: string | null; target_email?: string | null; details: Record<string, unknown>; created_at: string };

const emptyPlan: Plan = { id: '', name: '', description: '', amount_cents: 0, currency: 'usd', duration_days: 31, features: [], is_active: true, display_order: 10 };

export default function MembershipAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [editing, setEditing] = useState<Plan>(emptyPlan);
  const [saving, setSaving] = useState(false);
  const [memberPlan, setMemberPlan] = useState<Record<number, string>>({});

  async function loadData() {
    setError('');
    const responses = await Promise.all([fetch('/api/admin/membership/plans', { cache: 'no-store' }), fetch('/api/admin/membership/members', { cache: 'no-store' }), fetch('/api/admin/membership/activity', { cache: 'no-store' })]);
    if (responses.some((response) => response.status === 401 || response.status === 403)) { router.push('/login'); return; }
    if (responses.some((response) => !response.ok)) throw new Error('We could not load membership management data.');
    const [plansData, membersData, activityData] = await Promise.all(responses.map((response) => response.json()));
    setPlans(plansData.plans || []); setMembers(membersData.members || []); setActivity(activityData.activity || []);
    if (plansData.plans?.length && !editing.id) setEditing(plansData.plans[0]);
  }

  useEffect(() => { loadData().catch((cause) => setError(cause instanceof Error ? cause.message : 'We could not load membership management data.')).finally(() => setLoading(false)); }, []);

  const activeMembers = members.filter((member) => Boolean(member.subscription_plan && member.subscription_expires_at)).length;

  async function savePlan(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    try { const response = await fetch('/api/admin/membership/plans', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, name: editing.name, description: editing.description, amountCents: editing.amount_cents, currency: editing.currency, durationDays: editing.duration_days, features: Array.isArray(editing.features) ? editing.features : [], isActive: editing.is_active, displayOrder: editing.display_order }) }); if (!response.ok) throw new Error((await response.json()).error || 'Could not save this plan.'); await loadData(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save this plan.'); }
    finally { setSaving(false); }
  }

  async function updateMember(userId: number, action: 'grant' | 'extend' | 'cancel') {
    setError('');
    try { const response = await fetch('/api/admin/membership/members', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, action, planId: action === 'cancel' ? null : memberPlan[userId] || plans.find((plan) => plan.is_active)?.id, durationDays: 30 }) }); if (!response.ok) throw new Error((await response.json()).error || 'Could not update this member.'); await loadData(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update this member.'); }
  }

  if (loading) return <div className="admin-page page-shell"><div className="membership-status">Loading membership controls…</div></div>;

  return <div className="admin-page page-shell">
    <div className="admin-page__top"><Link href="/admin" className="admin-back"><ArrowLeft size={15} /> Admin dashboard</Link><span className="eyebrow"><ShieldCheck size={14} /> Membership control</span><h1>Plans, members, and activity.</h1><p>Manage what members can buy, who has access, and the changes made by administrators.</p></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="admin-metrics"><div><Users size={18} /><strong>{members.length}</strong><span>Total members</span></div><div><Check size={18} /><strong>{activeMembers}</strong><span>Active memberships</span></div><div><CreditCard size={18} /><strong>{plans.filter((plan) => plan.is_active).length}</strong><span>Live plans</span></div><div><History size={18} /><strong>{activity.length}</strong><span>Recorded actions</span></div></div>
    <section className="admin-section"><div className="admin-section__heading"><div><span className="eyebrow">Pricing</span><h2>Membership plans</h2><p>Prices are stored in cents and shown in the plan currency.</p></div><button className="button button--secondary" type="button" onClick={() => setEditing(emptyPlan)}>New plan</button></div><div className="admin-plan-layout"><div className="admin-plan-list">{plans.map((plan) => <button type="button" className={`admin-plan-list__item ${editing.id === plan.id ? 'is-selected' : ''}`} key={plan.id} onClick={() => setEditing(plan)}><span>{plan.name}</span><strong>{(plan.amount_cents / 100).toFixed(2)} {plan.currency.toUpperCase()}</strong><small>{plan.is_active ? 'Live' : 'Hidden'}</small></button>)}</div><form className="admin-edit-card" onSubmit={savePlan}><div className="admin-edit-card__heading"><h3>{editing.id ? 'Edit plan' : 'Create plan'}</h3><Save size={18} /></div><label><span className="form-label">Plan ID</span><input className="form-control" value={editing.id} onChange={(event) => setEditing({ ...editing, id: event.target.value })} placeholder="standard_monthly" required /></label><label><span className="form-label">Name</span><input className="form-control" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required /></label><label><span className="form-label">Description</span><textarea className="form-control" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} rows={3} /></label><div className="admin-form-grid"><label><span className="form-label">Price in cents</span><input className="form-control" type="number" min="0" value={editing.amount_cents} onChange={(event) => setEditing({ ...editing, amount_cents: Number(event.target.value) })} required /></label><label><span className="form-label">Currency</span><input className="form-control" value={editing.currency} maxLength={3} onChange={(event) => setEditing({ ...editing, currency: event.target.value.toLowerCase() })} required /></label><label><span className="form-label">Duration in days</span><input className="form-control" type="number" min="1" value={editing.duration_days} onChange={(event) => setEditing({ ...editing, duration_days: Number(event.target.value) })} required /></label><label><span className="form-label">Display order</span><input className="form-control" type="number" min="0" value={editing.display_order} onChange={(event) => setEditing({ ...editing, display_order: Number(event.target.value) })} required /></label></div><label><span className="form-label">Benefits (one per line)</span><textarea className="form-control" rows={4} value={editing.features.join('\n')} onChange={(event) => setEditing({ ...editing, features: event.target.value.split('\n').map((feature) => feature.trim()).filter(Boolean) })} /></label><label className="admin-checkbox"><input type="checkbox" checked={editing.is_active} onChange={(event) => setEditing({ ...editing, is_active: event.target.checked })} /> Show this plan on the membership page</label><button className="button button--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save plan'} <Save size={16} /></button></form></div></section>
    <section className="admin-section"><div className="admin-section__heading"><div><span className="eyebrow">Access</span><h2>Member access</h2><p>Grant, extend, or cancel access without changing a member’s account identity.</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Member</th><th>Plan</th><th>Expires</th><th>Actions</th></tr></thead><tbody>{members.map((member) => <tr key={member.id}><td><strong>{member.name || member.username || 'Unnamed member'}</strong><small>{member.email}</small></td><td><select className="form-control" value={memberPlan[member.id] || member.subscription_plan || ''} onChange={(event) => setMemberPlan({ ...memberPlan, [member.id]: event.target.value })}><option value="">Choose plan</option>{plans.filter((plan) => plan.is_active).map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select></td><td>{member.subscription_expires_at ? new Date(member.subscription_expires_at).toLocaleDateString() : 'No access'}</td><td><div className="admin-table__actions"><button type="button" className="button button--small" onClick={() => updateMember(member.id, member.subscription_expires_at ? 'extend' : 'grant')}>Grant / extend</button><button type="button" className="button button--small button--danger" onClick={() => updateMember(member.id, 'cancel')}>Cancel</button></div></td></tr>)}</tbody></table></div></section>
    <section className="admin-section"><div className="admin-section__heading"><div><span className="eyebrow">Audit trail</span><h2>Recent membership activity</h2></div><Clock3 size={20} /></div><div className="admin-activity">{activity.length ? activity.slice(0, 30).map((item) => <div className="admin-activity__item" key={item.id}><strong>{item.activity_type.replaceAll('_', ' ')}</strong><span>{item.target_email || item.plan_id || 'System'} · {new Date(item.created_at).toLocaleString()}</span></div>) : <p>No membership actions have been recorded yet.</p>}</div></section>
  </div>;
}
