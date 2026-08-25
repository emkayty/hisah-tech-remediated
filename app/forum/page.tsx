'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, MessageCircle, Plus, Search, ShieldCheck } from 'lucide-react';

type Category = { id: number; slug: string; name: string; description: string; thread_count: number };
type Thread = { id: number; title: string; body: string; category_slug: string; category_name: string; author_name: string; author_username?: string | null; reply_count: number; updated_at: string };

export default function ForumPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function loadForum() {
    setLoading(true);
    setError('');
    try {
      const [categoryResponse, threadResponse] = await Promise.all([
        fetch('/api/forum/categories', { cache: 'no-store' }),
        fetch(`/api/forum/threads${category ? `?category=${encodeURIComponent(category)}` : ''}`, { cache: 'no-store' }),
      ]);
      if (!categoryResponse.ok || !threadResponse.ok) throw new Error('The forum is temporarily unavailable.');
      setCategories(await categoryResponse.json());
      setThreads(await threadResponse.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The forum is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadForum(); }, [category]);

  const visibleThreads = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return threads;
    return threads.filter((thread) => `${thread.title} ${thread.body} ${thread.category_name}`.toLowerCase().includes(normalized));
  }, [query, threads]);

  async function createThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/forum/threads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categoryId: Number(form.get('categoryId')), title: String(form.get('title') || ''), body: String(form.get('body') || '') }) });
      const data = await response.json();
      if (response.status === 401) { setMessage('Sign in to start a discussion.'); return; }
      if (!response.ok) { setMessage(data.error || 'We could not create that discussion.'); return; }
      setShowComposer(false);
      event.currentTarget.reset();
      await loadForum();
    } catch {
      setMessage('A network issue interrupted the request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="forum-page page-shell">
      <section className="content-hero forum-hero">
        <span className="eyebrow"><MessageCircle size={14} /> Hisah Tech community</span>
        <h1>Ask clearly. Repair together.</h1>
        <p>A focused forum for practical repair questions, trusted approaches, and the details that help another technician move forward.</p>
        <div className="forum-hero__actions"><button type="button" className="button button--primary" onClick={() => setShowComposer(true)}><Plus size={16} /> Start a discussion</button><Link href="/contact" className="button button--outline">Talk to support <ArrowRight size={16} /></Link></div>
      </section>

      <section className="forum-layout" aria-label="Forum discussions">
        <aside className="forum-sidebar">
          <div className="forum-search"><Search size={17} /><input aria-label="Search discussions" placeholder="Search discussions" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <button type="button" className={`forum-category ${!category ? 'forum-category--active' : ''}`} onClick={() => setCategory('')}><strong>All discussions</strong><span>{categories.reduce((sum, item) => sum + item.thread_count, 0)}</span></button>
          {categories.map((item) => <button type="button" className={`forum-category ${category === item.slug ? 'forum-category--active' : ''}`} key={item.id} onClick={() => setCategory(item.slug)}><span><strong>{item.name}</strong><small>{item.description}</small></span><span>{item.thread_count}</span></button>)}
        </aside>
        <div className="forum-content">
          <div className="forum-content__heading"><div><span className="eyebrow"><BookOpen size={14} /> Community knowledge</span><h2>{category ? categories.find((item) => item.slug === category)?.name : 'Latest discussions'}</h2></div><span className="forum-count">{visibleThreads.length} {visibleThreads.length === 1 ? 'discussion' : 'discussions'}</span></div>
          {error && <div className="form-error" role="alert">{error}</div>}
          {loading ? <div className="forum-empty"><p>Loading discussions…</p></div> : visibleThreads.length === 0 ? <div className="forum-empty"><span className="content-empty__icon"><ShieldCheck size={24} /></span><h3>{query ? 'No discussions match that search.' : 'The forum is ready for its first discussion.'}</h3><p>{query ? 'Try a device model, symptom, or category.' : 'Ask a real repair question and give the community a useful place to begin. No sample threads are being shown.'}</p><button type="button" className="button button--primary" onClick={() => setShowComposer(true)}><Plus size={16} /> Start the first discussion</button></div> : <div className="thread-list">{visibleThreads.map((thread) => <Link className="thread-card" key={thread.id} href={`/forum/${thread.id}`}><div><span className="thread-card__category">{thread.category_name}</span><h3>{thread.title}</h3><p>{thread.body}</p><small>Started by {thread.author_name} · {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}</small></div><ArrowRight size={18} /></Link>)}</div>}
        </div>
      </section>

      {showComposer && <div className="auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="forum-composer-heading"><div className="auth-modal forum-composer"><div className="auth-modal__heading"><div><span className="eyebrow">New discussion</span><h2 id="forum-composer-heading">What are you working on?</h2><p>Share the device, symptom, and what you have already tested.</p></div><button className="icon-button" type="button" aria-label="Close discussion form" onClick={() => setShowComposer(false)}>×</button></div><form className="auth-form" onSubmit={createThread}><label><span className="form-label">Category</span><select className="form-control" name="categoryId" required defaultValue={categories[0]?.id || ''}><option value="" disabled>Select a category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><span className="form-label">Title</span><input className="form-control" name="title" minLength={4} maxLength={160} placeholder="e.g. ThinkPad T480 no power after BIOS update" required /></label><label><span className="form-label">Details</span><textarea className="form-control" name="body" minLength={1} maxLength={10000} rows={6} placeholder="Include the model, symptoms, measurements, and steps already tried." required /></label>{message && <div className="form-error" role="alert">{message}</div>}<button className="button button--primary" disabled={submitting} type="submit">{submitting ? 'Posting…' : 'Post discussion'} <ArrowRight size={16} /></button></form></div></div>}
    </main>
  );
}
