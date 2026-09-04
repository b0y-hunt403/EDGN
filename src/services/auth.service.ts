/*
 * MOCK AUTHENTICATION SERVICE — DEMO ONLY
 *
 * This service simulates authentication operations for presentation purposes.
 * Production implementation must replace this with real EDGN authentication APIs.
 */

import { demoUsers, roles } from "@/mocks/users";
import { findDemoAccountByEmail, DEMO_PASSWORD } from "@/mocks/demo-accounts";
import type {
  DemoRoleId,
  PortalId,
} from "@/types";
import type {
  User,
  Session,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

const SESSION_KEY = "edgn-auth-session-v1";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function generateToken(): string {
  return (
    "edgn_" +
    Array.from({ length: 48 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("")
  );
}

function generateReference(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `EDGN-REG-2026-${num}`;
}

function roleIdToPortal(roleId: DemoRoleId): PortalId {
  if (roleId === "bank-maker" || roleId === "bank-checker" || roleId === "bank-signatory")
    return "bank";
  return roleId as PortalId;
}

function mapDemoUserToUser(roleId: DemoRoleId): User {
  const demoUser = demoUsers[roleId];
  const roleMeta = roles.find((r) => r.id === roleId);
  return {
    id: demoUser.id,
    email: demoUser.email,
    name: demoUser.name,
    initials: demoUser.initials,
    title: demoUser.title,
    organization: demoUser.organization,
    roleId: demoUser.roleId,
    portal: roleIdToPortal(roleId),
    location: demoUser.location,
    phone: "+251 91 123 4567",
    emailVerified: true,
    createdAt: "2025-01-15",
  };
}

function createSession(user: User): Session {
  return {
    id: "sess-" + Date.now(),
    user,
    token: generateToken(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
    createdAt: Date.now(),
  };
}

function persistSession(session: Session): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

function clearSession(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    await new Promise((resolve) => window.setTimeout(resolve, 800));

    const demoAccount = findDemoAccountByEmail(request.email);
    if (!demoAccount || request.password !== DEMO_PASSWORD) {
      throw new Error("Invalid email or password. Please check your credentials and try again.");
    }

    const user = mapDemoUserToUser(demoAccount.roleId);
    const session = createSession(user);

    if (request.rememberMe) {
      persistSession(session);
    }

    return { session, user };
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    clearSession();
  },

  async register(request: RegistrationRequest): Promise<RegistrationResponse> {
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    return {
      success: true,
      reference: generateReference(),
      message:
        "Your organization registration has been received. EDGN will review the registration and onboarding requirements before activating your account.",
    };
  },

  async forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    return {
      message: `If an account exists for ${request.email}, a password reset link has been sent.`,
    };
  },

  async resetPassword(_request: ResetPasswordRequest): Promise<{ message: string }> {
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    return {
      message: "Your password has been reset successfully. You can now sign in.",
    };
  },

  getCurrentSession(): Session | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as Session;
      if (session.expiresAt < Date.now()) {
        clearSession();
        return null;
      }
      return session;
    } catch {
      clearSession();
      return null;
    }
  },

  async restoreSession(): Promise<Session | null> {
    return this.getCurrentSession();
  },

  switchUserRole(newRoleId: DemoRoleId): Session | null {
    const current = this.getCurrentSession();
    if (!current) return null;
    const updatedUser = mapDemoUserToUser(newRoleId);
    const updatedSession: Session = {
      ...current,
      user: updatedUser,
    };
    persistSession(updatedSession);
    return updatedSession;
  },
};
