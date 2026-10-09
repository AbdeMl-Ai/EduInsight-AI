'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, GraduationCap, LayoutDashboard, UserRound, Users } from 'lucide-react';
import ThemeToggle from '@/components/app/ThemeToggle';
import AuthGuard from '@/components/app/AuthGuard';
import LanguageSwitcher from '@/components/app/LanguageSwitcher';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import AdminToastProvider from '@/components/admin/AdminToastProvider';
import type { LucideIcon } from 'lucide-react';

const navigation: Array<{ href: string; label: 'overview' | 'people' | 'classes' | 'profile'; icon: LucideIcon }> = [
  { href: '/admin/home', label: 'overview', icon: LayoutDashboard },
  { href: '/admin/people', label: 'people', icon: Users },
  { href: '/admin/classes', label: 'classes', icon: BookOpen },
  { href: '/admin/profile', label: 'profile', icon: UserRound },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { messages } = useLandingLanguage();

  return (
    <AuthGuard role="admin">
    <AdminToastProvider>
    <div className="app-shell min-h-dvh bg-[#0a0a0a] text-[#f5f2e9]">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.07] bg-[#0a0a0a]/95 px-4 backdrop-blur-md sm:px-6">
        <Link href="/admin/home" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-yellow-500/30 bg-[#2A2420] text-[#dfc27e]">
            <GraduationCap size={18} strokeWidth={1.7} />
          </span>
          <span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">EDUINSIGHT AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-[10px] font-medium tracking-[0.12em] text-white/45 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            {messages.adminWorkspace}
          </span>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100dvh-3.5rem)] w-full max-w-5xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8">
        {children}
      </main>

      <nav
        aria-label={messages.navAdmin}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b0b0b]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      >
        <div className="mx-auto grid h-[4.2rem] w-full max-w-[560px] grid-cols-4">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-w-0 flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-[#dfc27e]' : 'text-white/45 hover:text-white/80'
                }`}
              >
                {active && <span className="absolute top-0 h-px w-8 bg-[#c6a96b]" />}
                <Icon size={19} strokeWidth={active ? 2 : 1.7} />
                <span className="max-w-full truncate text-[9px] font-medium">{messages[label]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </AdminToastProvider>
    </AuthGuard>
  );
}