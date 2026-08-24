"use client";

import { useEffect } from "react";

// Import screenshot capture utility - this will auto-initialize
import "@/utils/screenshot-capture";

// Patterns to ignore (internal React/Next.js messages)
const IGNORE_LIST = [
  /Download the React DevTools/,
  /You are running a development build of React/,
  /Warning: ReactDOM.render is no longer supported/,
  /Warning: React does not recognize/,
  /\[Fast Refresh\]/,
  /\[HMR\]/,
  /Compiled successfully/,
  /Compiling/,
  /webpack/i,
  /next-dev/,
];

function serialize(value: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(value, (_, v) => {
      if (typeof v === 'function') return '[Function]';
      if (typeof v === 'symbol') return v.toString();
      if (typeof v === 'undefined') return '[undefined]';
      if (typeof v === 'bigint') return v.toString() + 'n';
      if (v instanceof Date) {
        return { __t: 'Date', v: v.toISOString() };
      }
      if (v instanceof Error) {
        return { __t: 'Error', v: { name: v.name, message: v.message, stack: v.stack } };
      }
      if (v !== null && typeof v === 'object') {
        if ((v as any).$$typeof) return '[React Element]';
        if ((v as any).nodeType) return '[DOM Node]';
      }
      return v;
    }));
  } catch {
    return String(value);
  }
}

export function AppGenProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Setup console capture
    const levels = ['log', 'info', 'warn', 'error', 'debug', 'table', 'trace'] as const;
    const originals: Record<string, Function> = {};
    
    for (const level of levels) {
      originals[level] = (console as any)[level]?.bind(console);
      (console as any)[level] = (...args: unknown[]) => {
        originals[level]?.(...args);
        
        if (IGNORE_LIST.some((regex) => typeof args[0] === 'string' && regex.test(args[0]))) {
          return;
        }
        
        try {
          if (window.parent && window.parent !== window && typeof window.parent.postMessage === 'function') {
            window.parent.postMessage(
              { type: 'appgen:console', level, args: args.map(serialize), timestamp: Date.now() },
              '*'
            );
          }
        } catch { /* ignore */ }
      };
    }
    
    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      try {
        if (window.parent && window.parent !== window && typeof window.parent.postMessage === 'function') {
          window.parent.postMessage(
            {
              type: 'appgen:console',
              level: 'error',
              args: [JSON.stringify({ __t: 'Error', v: { name: 'UncaughtError', message: event.message, stack: 'at ' + event.filename + ':' + event.lineno + ':' + event.colno } })],
              timestamp: Date.now(),
            },
            '*'
          );
        }
      } catch { /* ignore */ }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        if (window.parent && window.parent !== window && typeof window.parent.postMessage === 'function') {
          const reason = event.reason;
          window.parent.postMessage(
            {
              type: 'appgen:console',
              level: 'error',
              args: [serialize(reason instanceof Error ? { __t: 'Error', v: { name: reason.name, message: reason.message, stack: reason.stack } } : reason)],
              timestamp: Date.now(),
            },
            '*'
          );
        }
      } catch { /* ignore */ }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Hide Next.js error overlay - runs periodically to catch dynamically injected overlays
    const hideErrorOverlay = () => {
      // Target Next.js error overlay elements
      const selectors = [
        'nextjs-portal',
        '[data-nextjs-dialog]',
        '[data-nextjs-dialog-overlay]', 
        '[data-nextjs-toast]',
        '#__next-build-indicator',
        '[data-nextjs-scroll]',
      ];
      
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
      });

      // Also hide the "1 Issue" button at the bottom
      document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent?.includes('Issue')) {
          (btn as HTMLElement).style.display = 'none';
          btn.parentElement && ((btn.parentElement as HTMLElement).style.display = 'none');
        }
      });
    };

    // Run immediately and set up observer for dynamic elements
    hideErrorOverlay();
    const interval = setInterval(hideErrorOverlay, 1000);
    
    // Use MutationObserver to catch new elements
    const observer = new MutationObserver(hideErrorOverlay);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      // Restore console methods
      for (const level of levels) {
        if (originals[level]) {
          (console as any)[level] = originals[level];
        }
      }
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
