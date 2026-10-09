'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

type AdminToast = { title: string; subtitle: string };
type AdminToastContextValue = { showSuccessToast: (subtitle: string, title?: string) => void };

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) throw new Error('useAdminToast must be used inside AdminToastProvider.');
  return context;
}

export default function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<AdminToast | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setToast(null);
  }, []);

  const showSuccessToast = useCallback((subtitle: string, title = 'Action completed') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ title, subtitle });
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setToast(null);
    }, 4200);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <AdminToastContext.Provider value={{ showSuccessToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] w-[min(24rem,calc(100vw-2rem))] sm:right-6 sm:top-6">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={`${toast.title}-${toast.subtitle}`}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, x: 42, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 28, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-white/95 p-3.5 text-slate-900 shadow-[0_16px_50px_rgba(15,23,42,0.2)] backdrop-blur-xl dark:border-emerald-300/20 dark:bg-slate-900/95 dark:text-white"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-300">
                <Check size={17} strokeWidth={2.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{toast.title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-600 dark:text-slate-300">{toast.subtitle}</span>
              </span>
              <button
                type="button"
                onClick={dismissToast}
                aria-label="Dismiss notification"
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminToastContext.Provider>
  );
}
