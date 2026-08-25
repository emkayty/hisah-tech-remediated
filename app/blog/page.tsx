import Link from 'next/link';
import { ArrowRight, BookMarked, PenLine, Sparkles } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="page-shell content-page">
      <section className="content-hero">
        <span className="eyebrow"><Sparkles size={14} /> Technical notes and practical thinking</span>
        <h1>Clear repair knowledge is worth waiting for.</h1>
        <p>The article space is being rebuilt alongside the resource library. Sample posts and invented popularity metrics have been removed so every future article can earn its place.</p>
      </section>
      <section className="content-empty">
        <span className="content-empty__icon"><BookMarked size={28} /></span>
        <div>
          <h2>No articles published yet.</h2>
          <p>When technical notes, explainers, and repair perspectives are ready, they will appear here in a calm, readable format built for people who want useful answers—not a noisy feed.</p>
          <div className="empty-state__actions">
            <Link href="/repair-guides" className="button button--primary">Explore repair guides <ArrowRight size={16} /></Link>
            <Link href="/contact" className="button button--outline"><PenLine size={16} /> Suggest a topic</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
