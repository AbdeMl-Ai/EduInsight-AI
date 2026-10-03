"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { api } from "@/lib/api";
import { hasWorkspaceAccess, type WorkspaceRole } from "@/lib/auth-token";

export default function AuthGuard({
  role,
  children,
}: {
  role: WorkspaceRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const { token } = api.getSession();
    if (hasWorkspaceAccess(token ?? undefined, role)) {
      setAuthorized(true);
      return;
    }

    api.logout();
    router.replace("/login");
  }, [role, router]);

  if (!authorized) {
    return (
      <div
        role="status"
        aria-label="Checking sign-in"
        className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] text-[#c6a96b]"
      >
        <LoaderCircle className="animate-spin" size={24} />
      </div>
    );
  }

  return children;
}
