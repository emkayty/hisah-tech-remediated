'use client';

import { useEffect, useState } from 'react';

type PaymentSetting = { provider: 'stripe' | 'paypal' | 'paystack' | 'crypto'; enabled: boolean; updated_at: string };

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSetting[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const loadSettings = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/payment-settings`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load payment settings');
    setSettings(data.settings);
  };

  useEffect(() => {
    void loadSettings().catch((error: Error) => setMessage(error.message));
  }, []);

  const updateProvider = async (provider: PaymentSetting['provider'], enabled: boolean) => {
    setPending(provider);
    setMessage(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/payment-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, enabled }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update provider');
      await loadSettings();
      setMessage(`${provider} status updated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update provider');
    } finally {
      setPending(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Payment provider status</h1>
      <p className="mt-3 text-slate-600">
        Provider secrets are managed only through deployment secrets. This screen never displays or stores credentials.
      </p>
      {message && <p role="status" className="mt-6 rounded-md bg-slate-100 p-3 text-sm text-slate-800">{message}</p>}
      <section className="mt-8 space-y-3">
        {settings.map((setting) => (
          <article key={setting.provider} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
            <div>
              <h2 className="font-semibold capitalize text-slate-900">{setting.provider}</h2>
              <p className="text-sm text-slate-500">{setting.enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <button
              type="button"
              disabled={pending !== null}
              onClick={() => updateProvider(setting.provider, !setting.enabled)}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending === setting.provider ? 'Saving…' : setting.enabled ? 'Disable' : 'Enable'}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
