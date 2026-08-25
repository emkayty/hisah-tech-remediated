'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';
import CountryPhoneField from '../components/CountryPhoneField';

export default function SignupPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email') || ''),
          password: String(form.get('password') || ''),
          name: String(form.get('name') || '').trim() || undefined,
          country: String(form.get('country') || ''),
          whatsapp_number: String(form.get('whatsapp_number') || ''),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error === 'Invalid request payload' ? 'Check your name, country, mobile number, email, and password.' : (data.error || 'We could not create your account. Please try again.'));
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
      <section className="auth-page__layout">
        <div className="auth-page__intro">
          <span className="auth-page__mark"><Wrench size={22} /></span>
          <span className="eyebrow"><ShieldCheck size={14} /> Hisah Tech account</span>
          <h1>Create your account.</h1>
          <p>Join discussions, keep useful repair work together, and return to the resources you need without starting over.</p>
          <div className="auth-page__note"><strong>Free to use</strong><span>No payment is required to create an account.</span></div>
        </div>
        <div className="auth-page__card">
          <div className="auth-page__card-heading">
            <div><h2>Account details</h2><p>Use an email address you can access.</p></div>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label><span className="form-label">Name <small>(optional)</small></span><input className="form-control" name="name" autoComplete="name" placeholder="Your name" /></label>
            <CountryPhoneField detectCountry />
            <label><span className="form-label">Email address</span><input className="form-control" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            <label><span className="form-label">Password</span><input className="form-control" name="password" type="password" autoComplete="new-password" placeholder="At least 12 characters" minLength={12} required /><small className="form-hint">Use at least 12 characters.</small></label>
            <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'} <ArrowRight size={16} /></button>
          </form>
          <p className="auth-page__switch">Already have an account? <Link href="/?auth=login">Sign in</Link></p>
        </div>
      </section>
    </div>
  );
}
