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
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';

type AuthMode = 'login' | 'signup';
type CurrentUser = { email: string; name?: string | null; username?: string | null };

const resources = [
  {
    href: '/bios-files',
    title: 'BIOS library',
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

  useEffect(() => {
    void checkAuth();
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
          name: String(form.get('name') || ''),
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
        setAuthError(data.error || 'We could not complete that request. Please try again.');
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
            <span className="eyebrow"><Sparkles size={14} /> Repair resources, without the noise</span>
            <h1>The clear starting point for every <em>repair.</em></h1>
            <p>Hisah Tech brings the essential technical resources into one calm, focused workspace—so you can spend less time searching and more time fixing.</p>
            <div className="hero__actions">
              <Link href="/bios-files" className="button button--primary">Explore the library <ArrowRight size={17} /></Link>
              <button type="button" className="button button--outline" onClick={() => openAuth('signup')}>Create a free account</button>
            </div>
            <p className="hero__signal"><span /> The platform is live and ready for verified resources.</p>
          </div>

          <div className="hero-card" aria-label="Hisah Tech workflow preview">
            <div className="hero-card__top">
              <span className="hero-card__pill">Focused workflow</span>
              <span className="hero-card__status"><b /> Ready when you are</span>
            </div>
            <div className="hero-card__panel">
              <small>Start with the essentials</small>
              <h2>Find the right next step.</h2>
              <p>Choose a resource type, identify the device, and work with a simpler repair process.</p>
              <div className="hero-card__steps">
                <div className="hero-card__step"><span>1</span> Select the resource you need</div>
                <div className="hero-card__step"><span>2</span> Search by device or board</div>
                <div className="hero-card__step"><span>3</span> Work from verified information</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-shell">
          <div className="section-heading">
            <span className="eyebrow"><Wrench size={14} /> Built around real repair work</span>
            <h2>Everything is organized around the job in front of you.</h2>
            <p>Instead of a cluttered forum feed, you get a clear path to the technical information that matters.</p>
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

      <section className="page-shell" aria-labelledby="library-status-heading">
        <div className="empty-state">
          <div>
            <span className="empty-state__icon"><ShieldCheck size={25} /></span>
            <h2 id="library-status-heading">A clean library, ready for trusted resources.</h2>
            <p>All demonstration material has been removed. New BIOS files, schematics, and guides will appear here as they are added and reviewed—keeping the experience honest, useful, and easy to trust.</p>
            <div className="empty-state__actions">
              <Link href="/contact" className="button button--primary">Request a resource <ArrowRight size={16} /></Link>
              <Link href="/repair-guides" className="button button--outline">See repair guides</Link>
            </div>
          </div>
          <aside className="empty-state__aside">
            <strong>Designed for clarity</strong>
            <p>No inflated counters, fake activity, or sample member profiles. Just a straightforward place to build a quality repair library.</p>
          </aside>
        </div>
      </section>

      <section className="how-section">
        <div className="page-shell">
          <div className="section-heading">
            <span className="eyebrow"><CheckCircle2 size={14} /> A simpler way to get moving</span>
            <h2>Three steps. One clear workflow.</h2>
          </div>
          <div className="steps-grid">
            <article className="step-card"><span className="step-card__number">01</span><h3>Choose your resource</h3><p>Start with firmware, a schematic, or a repair guide—each path is easy to find from any device.</p></article>
            <article className="step-card"><span className="step-card__number">02</span><h3>Search with confidence</h3><p>Use the simplest relevant device, board, or model detail to narrow your result without unnecessary friction.</p></article>
            <article className="step-card"><span className="step-card__number">03</span><h3>Make the next repair decision</h3><p>Use the resource as a practical next step, then return whenever you need another piece of the puzzle.</p></article>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="page-shell" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="cta-band__inner">
            <div>
              <h2>{currentUser ? `Welcome back${currentUser.name ? `, ${currentUser.name}` : ''}.` : 'Build your repair workflow with Hisah Tech.'}</h2>
              <p>{currentUser ? 'Your account is ready whenever you need to save, contribute, or explore.' : 'Create an account to take part as the resource library grows.'}</p>
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
                <p>{authMode === 'signup' ? 'A few details help us keep the community useful and secure.' : 'Sign in to continue where you left off.'}</p>
              </div>
              <button type="button" className="icon-button" onClick={closeAuth} aria-label="Close sign in dialog"><X size={18} /></button>
            </div>

            {authError && <div className="form-error" role="alert">{authError}</div>}
            <form className="auth-form" onSubmit={handleAuth}>
              {authMode === 'signup' && (
                <>
                  <label><span className="form-label">Your name <small>(optional)</small></span><input className="form-control" name="name" autoComplete="name" placeholder="Name" /></label>
                  <CountryPhoneField />
                </>
              )}
              <label><span className="form-label">Email address</span><input className="form-control" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
              <label><span className="form-label">Password</span><input className="form-control" name="password" type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder={authMode === 'signup' ? 'At least 12 characters' : 'Your password'} minLength={authMode === 'signup' ? 12 : undefined} required /></label>
              {authMode === 'login' && <Link href="/forgot-password" className="resource-card__link" onClick={closeAuth}>Forgot your password?</Link>}
              <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : authMode === 'signup' ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button>
            </form>
            <p className="auth-switch">{authMode === 'signup' ? 'Already have an account?' : 'New to Hisah Tech?'} <button type="button" onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setAuthError(''); }}>{authMode === 'signup' ? 'Sign in' : 'Create one'}</button></p>
          </div>
        </div>
      )}
    </>
  );
}
