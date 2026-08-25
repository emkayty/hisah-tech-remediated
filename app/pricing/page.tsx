import Link from 'next/link';
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="page-shell membership-page">
      <section className="membership-hero">
        <span className="eyebrow"><Sparkles size={14} /> Membership</span>
        <h1>Membership is not available yet.</h1>
        <p>Hisah Tech is free to use while the resource library and community grow. There is nothing to buy on this page, and you will not be charged for using the site.</p>
        <Link href="/contact" className="button button--primary">Contact support <ArrowRight size={16} /></Link>
      </section>
      <div className="membership-grid">
        <article>
          <span><BadgeCheck size={21} /></span>
          <h2>Use the site for free</h2>
          <p>Browse the available sections, join discussions, and use the tools without a subscription.</p>
        </article>
        <article>
          <span><ShieldCheck size={21} /></span>
          <h2>No surprise charges</h2>
          <p>If paid plans are introduced later, the options and prices will be shown clearly before any payment is requested.</p>
        </article>
      </div>
    </div>
  );
}
