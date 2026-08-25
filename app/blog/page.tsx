import Link from 'next/link';
import { ArrowRight, BookMarked, PenLine, Sparkles } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="page-shell content-page">
      <section className="content-hero">
        <span className="eyebrow"><Sparkles size={14} /> Technical notes and practical thinking</span>
        <h1>Useful repair knowledge, when you need it.</h1>
        <p>We are preparing short technical notes and explainers for common repair problems. Until then, use the guides and forum to find practical next steps.</p>
      </section>
      <section className="content-empty">
        <span className="content-empty__icon"><BookMarked size={28} /></span>
        <div>
          <h2>No articles are published yet.</h2>
          <p>New articles will focus on clear explanations, useful checks, and repair decisions you can apply at the bench.</p>
          <div className="empty-state__actions">
            <Link href="/repair-guides" className="button button--primary">Explore repair guides <ArrowRight size={16} /></Link>
            <Link href="/contact" className="button button--outline"><PenLine size={16} /> Suggest a topic</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
