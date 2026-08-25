'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '2348031233064';
  const message = 'Hello! I need help with Hisah Tech.';

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-grid h-12 w-12 place-items-center rounded-2xl border border-white/30 bg-[#20bf7a] text-white shadow-[0_12px_28px_rgba(8,120,75,.32)] transition duration-200 hover:-translate-y-1 hover:bg-[#10a768] focus:outline-none focus:ring-4 focus:ring-[#20bf7a]/25"
      aria-label="Chat with Hisah Tech on WhatsApp"
    >
      <MessageCircle size={21} strokeWidth={2.4} />
    </a>
  );
}
