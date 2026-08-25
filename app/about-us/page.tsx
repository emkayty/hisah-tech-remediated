import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Wrench } from 'lucide-react';

const strengths = [
  'Computer and laptop repair',
  'Hardware diagnostics and testing',
  'Genuine replacement parts and accessories',
  'Practical technical support',
];

export default function AboutUsPage() {
  return (
    <div className="page-shell about-page">
      <section className="about-hero">
        <span className="eyebrow"><Wrench size={14} /> Hisah Tech Limited</span>
        <h1>Technical work deserves a clearer way forward.</h1>
        <p>Hisah Tech Limited is a private technology company based in Minna, Niger State, Nigeria. The company was incorporated on 16 October 2019 as a private company limited by shares (RC Number: 1624952).</p>
      </section>

      <div className="about-grid">
        <article className="about-card about-card--mission">
          <span className="about-card__icon"><ShieldCheck size={22} /></span>
          <h2>What we are building</h2>
          <p>Hisah Tech combines hands-on technical work with a cleaner digital home for useful repair resources. The focus is simple: practical information, clear access, and a better experience for the people doing the work.</p>
        </article>
        <article className="about-card">
          <span className="about-card__icon"><MapPin size={22} /></span>
          <h2>Based in Minna</h2>
          <p>Suite B23/B22, Peniel Albarka Plaza, opposite Federal High Court, Minna, Niger State, Nigeria.</p>
        </article>
      </div>

      <section className="about-services">
        <div className="section-heading"><span className="eyebrow">What we do</span><h2>Focused technical services, built around practical needs.</h2></div>
        <div className="about-services__list">
          {strengths.map((strength) => <div key={strength}><CheckCircle2 size={18} /> <span>{strength}</span></div>)}
        </div>
      </section>

      <section className="cta-band" style={{ paddingBottom: 0 }}>
        <div className="cta-band__inner">
          <div><h2>Need help with a repair or resource?</h2><p>Tell us what you are working on and choose the contact path that works best for you.</p></div>
          <Link href="/contact" className="button">Contact Hisah Tech <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}
