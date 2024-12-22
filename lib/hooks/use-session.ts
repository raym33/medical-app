"use client";

import { useEffect } from 'react';
import { useAuth } from './use-auth';
import { SECURITY_CONFIG } from '@/lib/constants/security';
import { SessionManager } from '@/lib/security/session-manager';

export function useSession() {
  const { user } = useAuth();
  const sessionManager = SessionManager.getInstance();

  useEffect(() => {
    if (!user) return;

    const checkSession = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      const isValid = await sessionManager.validateSession(sessionId);
      if (!isValid) {
        localStorage.removeItem('sessionId');
        window.location.href = '/auth/login';
        return;
      }

      await sessionManager.extendSession(sessionId);
    };

    const interval = setInterval(checkSession, SECURITY_CONFIG.session.renewThreshold);
    return () => clearInterval(interval);
  }, [user]);
}