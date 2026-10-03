'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  BookOpen,
  GraduationCap,
  House,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ThemeToggle from '@/components/app/ThemeToggle';
import AuthGuard from '@/components/app/AuthGuard';

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { href: '/student/home', label: 'Home', icon: House },
  { href: '/student/courses', label: 'Courses', icon: BookOpen },
  { href: '/student/notifications', label: 'Notifications', icon: Bell },
  { href: '/student/profile', label: 'Profile', icon: UserRound },
];

function isActivePath(pathname: string, href: string) {
  return href === '/student'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard role="student">
    <div className="app-shell min-h-dvh bg-[#0a0a0a] text-[#f5f2e9]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0a0a0a] px-5 py-7 md:flex">
        <Link href="/student/home" className="mb-12 flex items-center gap-3 px-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-yellow-500/30 bg-[#2A2420] text-[#dfc27e]">
            <GraduationCap size={18} />
          </span>
          <span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">EDUINSIGHT AI</span>
        </Link>
        <nav aria-label="Student navigation" className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                  active
                    ? 'bg-[#c6a96b]/10 text-[#e0c583]'
                    : 'text-white/55 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-auto px-2 text-[10px] font-medium tracking-[0.18em] text-white/30">STUDENT PORTAL</p>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.07] bg-[#0a0a0a]/95 px-4 backdrop-blur-md sm:px-6 md:h-16 md:px-10">
          <Link href="/student/home" className="flex items-center gap-2.5 md:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg border border-yellow-500/30 bg-[#2A2420] text-[#dfc27e]">
              <GraduationCap size={18} />
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">EDUINSIGHT AI</span>
          </Link>
          <div className="hidden text-xs font-medium tracking-[0.16em] text-white/40 md:block">STUDENT PORTAL</div>
          <div className="ml-auto flex items-center gap-3 text-[11px] text-white/45">
            <span className="hidden items-center gap-2 sm:flex"><span className="size-1.5 rounded-full bg-[#c6a96b]" />Learning space</span>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100dvh-3.5rem)] w-full max-w-6xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8 md:min-h-[calc(100dvh-4rem)] md:px-10 md:pb-12 md:pt-10">
          {children}
        </main>
      </div>

      <nav
        aria-label="Student navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b0b0b]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid h-[4.15rem] w-full max-w-[360px] grid-cols-4">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
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
                <span className="max-w-full truncate text-[9px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </AuthGuard>
  );
}
