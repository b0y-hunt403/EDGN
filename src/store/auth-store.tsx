"use client";

/*
 * MOCK AUTHENTICATION STORE — DEMO ONLY
 *
 * This authentication store manages frontend-only mock authentication state.
 * Production implementation must replace this with real EDGN auth infrastructure.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { roleHome } from "@/config/roles";
import type { DemoRoleId } from "@/types";
import type { User, Session, LoginRequest, RegistrationRequest } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (request: RegistrationRequest) => Promise<{ reference: string; message: string }>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
  switchUserRole: (roleId: DemoRoleId) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restored = authService.restoreSession();
    restored.then((s) => {
      setSession(s);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(request);
      setSession(response.session);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const register = useCallback(async (request: RegistrationRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(request);
      return { reference: response.reference, message: response.message };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword({ email });
      return response.message;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.resetPassword({ token, newPassword });
      return response.message;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reset failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchUserRole = useCallback((roleId: DemoRoleId) => {
    const updated = authService.switchUserRole(roleId);
    if (updated) {
      setSession(updated);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isAuthenticated: !!session,
      isLoading,
      error,
      login,
      logout,
      register,
      forgotPassword,
      resetPassword,
      switchUserRole,
      clearError,
    }),
    [session, isLoading, error, login, logout, register, forgotPassword, resetPassword, switchUserRole, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return value;
}
