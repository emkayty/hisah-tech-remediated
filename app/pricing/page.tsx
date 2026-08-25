import Link from 'next/link';
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="page-shell membership-page">
      <section className="membership-hero">
        <span className="eyebrow"><Sparkles size={14} /> Membership, thoughtfully introduced</span>
        <h1>Premium access is being prepared with care.</h1>
        <p>Hisah Tech will introduce membership when the resource library and secure checkout experience are ready to support it properly. Until then, there is no hidden billing and no incomplete purchase path.</p>
        <Link href="/contact" className="button button--primary">Ask about membership <ArrowRight size={16} /></Link>
      </section>
      <div className="membership-grid">
        <article>
          <span><BadgeCheck size={21} /></span>
          <h2>Useful access first</h2>
          <p>The focus is on building a dependable resource experience before introducing paid access or feature tiers.</p>
        </article>
        <article>
          <span><ShieldCheck size={21} /></span>
          <h2>Secure by design</h2>
          <p>Checkout will only become available once provider configuration, server validation, and payment controls are fully verified.</p>
        </article>
      </div>
    </div>
  );
}
