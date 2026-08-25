'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CountryPhoneField from './components/CountryPhoneField';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCode2,
  Files,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';

type AuthMode = 'login' | 'signup';
type CurrentUser = { email: string; name?: string | null; username?: string | null };
type ForumThreadPreview = { id: number; title: string; body: string; category_name: string; author_name: string; reply_count: number; updated_at: string };

const resources = [
  {
    href: '/bios-files',
    title: 'BIOS files',
    description: 'Find firmware resources through a clean, device-first catalog built for practical work.',
    icon: Files,
    action: 'Browse BIOS files',
  },
  {
    href: '/schematics',
    title: 'Schematics',
    description: 'Keep technical diagrams discoverable and easy to scan when you are deep in a repair.',
    icon: FileCode2,
    action: 'Explore schematics',
  },
  {
    href: '/repair-guides',
    title: 'Repair guides',
    description: 'Move from symptom to next step with concise, useful repair guidance and practical context.',
    icon: BookOpen,
    action: 'Read repair guides',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forumThreads, setForumThreads] = useState<ForumThreadPreview[]>([]);
  const [forumLoading, setForumLoading] = useState(true);
  const [forumError, setForumError] = useState('');

  useEffect(() => {
    void checkAuth();
  }, []);

  useEffect(() => {
    void loadForumActivity();
  }, []);

  useEffect(() => {
    const requestedMode = new URLSearchParams(window.location.search).get('auth');
    if (requestedMode === 'login' || requestedMode === 'signup') {
      setAuthMode(requestedMode);
      setShowAuthModal(true);
      setAuthError('');
    }
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await response.json();
      if (data.user) setCurrentUser(data.user);
    } catch {
      // Visitors can use the resource library without signing in.
    }
  }

  async function loadForumActivity() {
    try {
      const response = await fetch('/api/forum/threads', { cache: 'no-store' });
      if (!response.ok) throw new Error('We could not load recent discussions.');
      const data = await response.json();
      setForumThreads(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (cause) {
      setForumError(cause instanceof Error ? cause.message : 'We could not load recent discussions.');
    } finally {
      setForumLoading(false);
    }
  }

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthError('');
    setShowAuthModal(true);
  }

  function closeAuth() {
    setShowAuthModal(false);
    setAuthError('');
    router.replace('/', { scroll: false });
  }

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const isSignup = authMode === 'signup';

    const body = isSignup
      ? {
          email: String(form.get('email') || ''),
          password: String(form.get('password') || ''),
          name: String(form.get('name') || '').trim() || undefined,
          country: String(form.get('country') || ''),
          whatsapp_number: String(form.get('whatsapp_number') || ''),
        }
      : {
          email: String(form.get('email') || ''),
          password: String(form.get('password') || ''),
        };

    try {
      const response = await fetch(isSignup ? '/api/auth/signup' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        const fallback = isSignup
          ? 'Please check your email, password, country, and mobile number.'
          : 'Please enter your email and password.';
        setAuthError(data.error === 'Invalid request payload' ? fallback : (data.error || 'We could not complete that request. Please try again.'));
        return;
      }
      setCurrentUser(data.user);
      closeAuth();
    } catch {
      setAuthError('A network issue interrupted the request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero__grid">
          <div className="hero__copy">
            <span className="eyebrow"><Sparkles size={14} /> Tools for practical repairs</span>
            <h1>Get clear, practical help for your next <em>repair.</em></h1>
            <p>Find firmware, schematics, repair notes, and people who understand the work. Everything is arranged to help you diagnose the problem and move on.</p>
            <div className="hero__actions">
              <Link href="/bios-files" className="button button--primary">Browse BIOS files <ArrowRight size={17} /></Link>
              <button type="button" className="button button--outline" onClick={() => openAuth('signup')}>Create a free account</button>
            </div>
            <p className="hero__signal"><span /> Clear information, useful conversations, and no inflated activity.</p>
          </div>

          <div className="hero-card" aria-label="Hisah Tech workflow preview">
            <div className="hero-card__top">
              <span className="hero-card__pill">Repair workspace</span>
              <span className="hero-card__status"><b /> Open to everyone</span>
            </div>
            <div className="hero-card__panel">
              <small>Start with the information you have</small>
              <h2>Start with the basics.</h2>
              <p>Choose a section, identify the device, and keep the important details in one place.</p>
              <div className="hero-card__steps">
                <div className="hero-card__step"><span>1</span> Choose a resource section</div>
                <div className="hero-card__step"><span>2</span> Search by model or board</div>
                <div className="hero-card__step"><span>3</span> Ask when you need another view</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-shell">
          <div className="section-heading">
            <span className="eyebrow"><Wrench size={14} /> Find your way around</span>
            <h2>Three useful places to start.</h2>
            <p>Go straight to the section that matches the job: look up a file, check a diagram, read a guide, or ask the community.</p>
          </div>
          <div className="resource-grid">
            {resources.map(({ href, title, description, icon: Icon, action }) => (
              <Link key={href} href={href} className="resource-card">
                <span className="resource-card__icon"><Icon size={23} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="resource-card__link">{action} <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="forum-activity-section">
        <div className="page-shell">
          <div className="section-heading forum-activity__heading">
            <span className="eyebrow"><MessageCircle size={14} /> From the forum</span>
            <h2>Recent repair conversations.</h2>
            <p>See what people are working through, or start a discussion with the details you have.</p>
          </div>
          {forumLoading ? <div className="forum-activity__status">Loading recent discussions…</div> : forumError ? <div className="forum-activity__status forum-activity__status--error" role="status">{forumError} <Link href="/forum">Open the forum <ArrowRight size={15} /></Link></div> : forumThreads.length === 0 ? <div className="forum-activity__empty"><div><h3>No discussions yet.</h3><p>Be the first to ask a repair question. Include the model, symptoms, measurements, and steps already tried.</p></div><Link href="/forum" className="button button--primary">Open the forum <ArrowRight size={16} /></Link></div> : <div className="forum-activity__grid">{forumThreads.map((thread) => <Link href={`/forum/${thread.id}`} className="forum-activity__card" key={thread.id}><span>{thread.category_name}</span><h3>{thread.title}</h3><p>{thread.body}</p><small>{thread.author_name} · {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}</small><ArrowRight size={16} /></Link>)}</div>}
        </div>
      </section>

      <section className="page-shell" aria-labelledby="library-status-heading">
        <div className="empty-state">
          <div>
            <span className="empty-state__icon"><ShieldCheck size={25} /></span>
            <h2 id="library-status-heading">The library is growing one useful resource at a time.</h2>
            <p>Some sections are still being filled. When you cannot find what you need, send us the model and repair details so the next addition is useful to someone doing the same work.</p>
            <div className="empty-state__actions">
              <Link href="/contact" className="button button--primary">Request a resource <ArrowRight size={16} /></Link>
              <Link href="/repair-guides" className="button button--outline">See repair guides</Link>
              <Link href="/forum" className="button button--outline"><MessageCircle size={16} /> Visit the forum</Link>
            </div>
          </div>
          <aside className="empty-state__aside">
            <strong>What you can expect</strong>
            <p>Published resources and real discussions only, with clear links and no invented activity.</p>
          </aside>
        </div>
      </section>

      <section className="how-section">
        <div className="page-shell">
          <div className="section-heading">
            <span className="eyebrow"><CheckCircle2 size={14} /> Keep the process simple</span>
            <h2>Move from problem to next step.</h2>
          </div>
          <div className="steps-grid">
            <article className="step-card"><span className="step-card__number">01</span><h3>Choose where to look</h3><p>Open the section that matches your task instead of searching through unrelated pages.</p></article>
            <article className="step-card"><span className="step-card__number">02</span><h3>Share the right details</h3><p>Use the model, board number, symptoms, and steps already tried to make the answer easier to find.</p></article>
            <article className="step-card"><span className="step-card__number">03</span><h3>Keep working</h3><p>Use what you find, ask a follow-up question when needed, and return to the same workspace later.</p></article>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="page-shell" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="cta-band__inner">
            <div>
              <h2>{currentUser ? `Welcome back${currentUser.name ? `, ${currentUser.name}` : ''}.` : 'Keep your repair work moving with Hisah Tech.'}</h2>
              <p>{currentUser ? 'Your account is ready for discussions, saved work, and the resource library.' : 'Create a free account to join discussions and keep your repair work together.'}</p>
            </div>
            {currentUser ? <Link href="/dashboard" className="button">Go to dashboard <ArrowRight size={16} /></Link> : <button type="button" className="button" onClick={() => openAuth('signup')}>Create account <ArrowRight size={16} /></button>}
          </div>
        </div>
      </section>

      {showAuthModal && (
        <div className="auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-heading">
          <div className="auth-modal">
            <div className="auth-modal__heading">
              <div>
                <span className="eyebrow">Hisah Tech account</span>
                <h2 id="auth-heading">{authMode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
                <p>{authMode === 'signup' ? 'Create your account in a minute. We only ask for the details we need.' : 'Sign in to pick up where you left off.'}</p>
              </div>
              <button type="button" className="icon-button" onClick={closeAuth} aria-label="Close sign in dialog"><X size={18} /></button>
            </div>

            {authError && <div className="form-error" role="alert">{authError}</div>}
            <form className="auth-form" onSubmit={handleAuth}>
              {authMode === 'signup' && (
                <>
                  <label><span className="form-label">Your name <small>(optional)</small></span><input className="form-control" name="name" autoComplete="name" placeholder="Name" /></label>
                  <CountryPhoneField detectCountry />
                </>
              )}
              <label><span className="form-label">Email address</span><input className="form-control" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
              <label><span className="form-label">Password</span><input className="form-control" name="password" type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder={authMode === 'signup' ? 'At least 12 characters' : 'Your password'} minLength={authMode === 'signup' ? 12 : undefined} required />{authMode === 'signup' && <small className="form-hint">Use at least 12 characters.</small>}</label>
              {authMode === 'login' && <Link href="/forgot-password" className="resource-card__link" onClick={closeAuth}>Forgot your password?</Link>}
              <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Working…' : authMode === 'signup' ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button>
            </form>
            <p className="auth-switch">{authMode === 'signup' ? 'Already have an account?' : 'Need a Hisah Tech account?'} <button type="button" onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setAuthError(''); }}>{authMode === 'signup' ? 'Sign in' : 'Create an account'}</button></p>
          </div>
        </div>
      )}
    </>
  );
}
