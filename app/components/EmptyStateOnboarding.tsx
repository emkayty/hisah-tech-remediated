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
        <span className="eyebrow">New to Hisah Tech?</span>
        <button type="button" className="onboarding-card__close" onClick={dismiss} aria-label="Dismiss getting started guide"><X size={17} /></button>
      </div>
      <p className="onboarding-card__intro">Start with the resource you need, or tell us what is missing. The site is built to keep repair work focused and easy to follow.</p>
      <ol className="onboarding-steps">
        <li><span>1</span><div><strong>Choose a section.</strong><small>Browse firmware, schematics, guides, or discussions.</small></div></li>
        <li><span>2</span><div><strong>Give useful details.</strong><small>Include the model, board, fault, and steps tried.</small></div></li>
        <li><span>3</span><div><strong>Use the next step.</strong><small>Save your place, ask a question, and keep working.</small></div></li>
      </ol>
      <button type="button" className="onboarding-card__done" onClick={dismiss}><Check size={15} /> Understood <ArrowRight size={14} /></button>
    </aside>
  );
}
