import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, FileCode2, Files, FolderSearch, ShieldCheck } from 'lucide-react';

type ResourceKind = 'bios' | 'schematics' | 'guides';

const content: Record<ResourceKind, { eyebrow: string; title: string; description: string; icon: typeof Files; tone: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string; }> = {
  bios: {
    eyebrow: 'Firmware resources',
    title: 'BIOS files, organized for the work ahead.',
    description: 'The BIOS library has been cleared of demonstration material. Verified firmware resources will appear here as they are added to the collection.',
    icon: Files,
    tone: '#2848ff',
    primaryLabel: 'Request a BIOS file',
    primaryHref: '/contact',
    secondaryLabel: 'Browse schematics',
    secondaryHref: '/schematics',
  },
  schematics: {
    eyebrow: 'Technical diagrams',
    title: 'Schematics without the clutter.',
    description: 'There are no sample diagrams in this library. New schematics will be added only after they are ready to be a genuinely useful repair reference.',
    icon: FileCode2,
    tone: '#087e68',
    primaryLabel: 'Request a schematic',
    primaryHref: '/contact',
    secondaryLabel: 'Explore repair guides',
    secondaryHref: '/repair-guides',
  },
  guides: {
    eyebrow: 'Practical learning',
    title: 'Guidance that earns its place on the bench.',
    description: 'The guide collection is currently empty by design. The next resources added here will be concise, practical, and focused on real repair decisions.',
    icon: BookOpen,
    tone: '#7956e9',
    primaryLabel: 'Suggest a guide',
    primaryHref: '/contact',
    secondaryLabel: 'Browse BIOS files',
    secondaryHref: '/bios-files',
  },
};

export default function ResourceEmptyPage({ kind }: { kind: ResourceKind }) {
  const item = content[kind];
  const Icon = item.icon;

  return (
    <div className="page-shell">
      <Link href="/" className="resource-card__link" style={{ marginBottom: '2.25rem' }}><ArrowLeft size={15} /> Back to home</Link>
      <section className="catalog-hero" style={{ '--catalog-tone': item.tone } as React.CSSProperties}>
        <span className="catalog-hero__icon"><Icon size={26} /></span>
        <div>
          <span className="eyebrow">{item.eyebrow}</span>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
        </div>
      </section>
      <section className="catalog-empty">
        <div className="catalog-empty__visual"><FolderSearch size={34} /></div>
        <div>
          <span className="eyebrow"><ShieldCheck size={14} /> Quality over quantity</span>
          <h2>Nothing misleading. Nothing to sift through.</h2>
          <p>We removed all placeholder material so this section can grow into a dependable, easy-to-navigate resource. If you need something specific, tell us what you are working on.</p>
          <div className="empty-state__actions">
            <Link href={item.primaryHref} className="button button--primary">{item.primaryLabel} <ArrowRight size={16} /></Link>
            <Link href={item.secondaryHref} className="button button--outline">{item.secondaryLabel}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
