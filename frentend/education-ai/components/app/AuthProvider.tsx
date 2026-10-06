'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, AUTH_SESSION_CHANGED_EVENT } from '@/lib/api';
import { getRoleFromToken, type AuthenticatedRole } from '@/lib/auth-token';

type AuthSession = {
  token: string;
  role: AuthenticatedRole;
};

type AuthContextValue = {
  session: AuthSession | null;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function getDashboardPath(role: AuthenticatedRole) {
  if (role === 'student' || role === 'user') return '/student/home';
  return `/${role}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function syncSession() {
      const { token } = api.getSession();
      const role = getRoleFromToken(token ?? undefined);

      if (token && role) {
        setSession({ token, role });
      } else {
        setSession(null);
        if (token) api.logout();
      }
      setIsReady(true);
    }

    syncSession();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
