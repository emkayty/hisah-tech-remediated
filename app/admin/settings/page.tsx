import Link from 'next/link';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  return <div className="admin-page page-shell"><Link href="/admin" className="admin-back"><ArrowLeft size={15} /> Admin dashboard</Link><div className="admin-page__top"><span className="eyebrow"><ShieldCheck size={14} /> Configuration</span><h1>System settings</h1><p>Keep operational settings grouped in one place. Sensitive provider credentials remain in deployment configuration and are never entered here.</p></div><section className="settings-grid"><Link href="/admin/payment-settings" className="settings-card"><CreditCard size={20} /><strong>Payment providers</strong><span>Enable or pause configured payment methods.</span></Link><Link href="/admin/membership" className="settings-card"><ShieldCheck size={20} /><strong>Membership control</strong><span>Manage plans, member access, and the activity record.</span></Link></section></div>;
}
