'use client';

import { LogOut } from 'lucide-react';
import { handleLogout } from '@/lib/auth';

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-rose-300/20 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-300/[0.06]"
    >
      <LogOut size={15} />
      Logout
    </button>
  );
}
