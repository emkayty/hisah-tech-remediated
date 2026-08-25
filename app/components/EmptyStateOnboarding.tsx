'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Lightbulb, X } from 'lucide-react';

const STORAGE_KEY = 'hisah-tech-empty-state-onboarding-seen';

export default function EmptyStateOnboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== 'true');
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // The onboarding should still be dismissible when storage is unavailable.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="onboarding-card" aria-label="Getting started guide">
      <div className="onboarding-card__topline">
        <span className="onboarding-card__icon"><Lightbulb size={18} /></span>
        <span className="eyebrow">New here? Start in three steps.</span>
        <button type="button" className="onboarding-card__close" onClick={dismiss} aria-label="Dismiss getting started guide"><X size={17} /></button>
      </div>
      <p className="onboarding-card__intro">This library is intentionally empty right now. Here is the quickest way to make it useful for your repair.</p>
      <ol className="onboarding-steps">
        <li><span>1</span><div><strong>Choose your resource.</strong><small>Start with BIOS, schematics, or guides.</small></div></li>
        <li><span>2</span><div><strong>Tell us what you need.</strong><small>Send the device or board detail through support.</small></div></li>
        <li><span>3</span><div><strong>Return when it is ready.</strong><small>New verified resources will appear here.</small></div></li>
      </ol>
      <button type="button" className="onboarding-card__done" onClick={dismiss}><Check size={15} /> Got it <ArrowRight size={14} /></button>
    </aside>
  );
}
