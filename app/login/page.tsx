'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, Wrench } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: String(form.get('email') || ''), password: String(form.get('password') || '') }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'The email or password is not correct. Please try again.');
        return;
      }
      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError('A network issue interrupted the request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page page-shell">
      <div className="auth-page__back"><Link href="/"><ArrowLeft size={15} /> Back to home</Link></div>
      <section className="auth-page__layout auth-page__layout--login">
        <div className="auth-page__intro">
          <span className="auth-page__mark"><Wrench size={22} /></span>
          <span className="eyebrow"><LockKeyhole size={14} /> Hisah Tech account</span>
          <h1>Welcome back.</h1>
          <p>Sign in to return to your discussions, saved work, and the repair resources you use most.</p>
        </div>
        <div className="auth-page__card">
          <div className="auth-page__card-heading"><h2>Sign in</h2><p>Use the email and password for your account.</p></div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label><span className="form-label">Email address</span><input className="form-control" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            <label><span className="form-label">Password</span><input className="form-control" name="password" type="password" autoComplete="current-password" placeholder="Your password" required /></label>
            <Link href="/forgot-password" className="resource-card__link">Forgot your password?</Link>
            <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button>
          </form>
          <p className="auth-page__switch">New to Hisah Tech? <Link href="/signup">Create an account</Link></p>
        </div>
      </section>
    </div>
  );
}
