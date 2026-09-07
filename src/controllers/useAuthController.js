import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../api';
import { getToken, setToken } from '../api/client';

export function useAuthController() {
  const [admin, setAdmin] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // On first load, if a token is already stored, verify it and restore the session.
  useEffect(() => {
    let cancelled = false;
    async function restoreSession() {
      if (!getToken()) {
        setCheckingSession(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) setAdmin(me);
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }
    restoreSession();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    setLoggingIn(true);
    setLoginError(null);
    try {
      const { token, admin: loggedInAdmin } = await authApi.login(email, password);
      setToken(token);
      setAdmin(loggedInAdmin);
      return true;
    } catch (err) {
      setLoginError(err.message || 'Login failed');
      return false;
    } finally {
      setLoggingIn(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
  }, []);

  return {
    admin,
    isAuthenticated: Boolean(admin),
    checkingSession,
    loginError,
    loggingIn,
    login,
    logout,
  };
}
