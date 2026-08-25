import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, FileCode2, Files, FolderSearch, ShieldCheck } from 'lucide-react';
import EmptyStateOnboarding from './EmptyStateOnboarding';

type ResourceKind = 'bios' | 'schematics' | 'guides';

const content: Record<ResourceKind, { eyebrow: string; title: string; description: string; icon: typeof Files; tone: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string; }> = {
  bios: {
    eyebrow: 'Firmware resources',
    title: 'BIOS files, organized for the work ahead.',
    description: 'The BIOS library is being built with verified firmware files that are safe to identify, download, and use for supported repairs.',
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
    description: 'Find board-level diagrams and service references as they are added and checked for clarity.',
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
    description: 'Short, practical repair notes are being added for common faults, tools, and diagnostic steps.',
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
          <span className="eyebrow"><ShieldCheck size={14} /> Library status</span>
          <h2>No resources have been added yet.</h2>
          <p>There are no files here yet. If you need a particular model, board, schematic, or repair topic, send us the details and we will use them to shape the collection.</p>
          <div className="empty-state__actions">
            <Link href={item.primaryHref} className="button button--primary">{item.primaryLabel} <ArrowRight size={16} /></Link>
            <Link href={item.secondaryHref} className="button button--outline">{item.secondaryLabel}</Link>
          </div>
        </div>
      </section>
      <EmptyStateOnboarding />
    </div>
  );
}
