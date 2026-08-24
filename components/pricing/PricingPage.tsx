'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Membership checkout</h1>
      <p className="mt-4 text-slate-600">
        Secure checkout is temporarily unavailable while payment verification is being configured.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        No payment details or subscription changes are accepted through this page until a server-verified provider is enabled.
      </p>
      <Link
        className="mt-8 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        href="/contact"
      >
        Contact support
      </Link>
    </section>
  );
}
