'use client';

export type CryptoPaymentProps = {
  plan?: string;
  amount?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function CryptoPayment({ onCancel }: CryptoPaymentProps) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">Crypto checkout unavailable</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Cryptocurrency checkout is disabled until transaction validation, confirmation monitoring, and reconciliation are independently verified.
        </p>
        <button type="button" onClick={onCancel} className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Close
        </button>
      </section>
    </div>
  );
}
