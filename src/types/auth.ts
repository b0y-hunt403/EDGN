/*
 * MOCK AUTHENTICATION TYPES — DEMO ONLY
 *
 * This frontend authentication layer is designed for presentation and UI testing.
 * Production implementation must replace mock authentication with the real EDGN
 * authentication and identity infrastructure.
 */

import type { DemoRoleId, PortalId } from "@/types";

export type UserRole = DemoRoleId;

export interface User {
  id: string;
  email: string;
  name: string;
  initials: string;
  title: string;
  organization: string;
  roleId: UserRole;
  portal: PortalId;
  location: string;
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  user: User;
  token: string;
  expiresAt: number;
  createdAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  session: Session;
  user: User;
}

export interface RegistrationRequest {
  accountType: "applicant" | "beneficiary" | "bank" | "developer";
  organization: {
    name: string;
    type: string;
    registrationNumber: string;
    tin: string;
    country: string;
    region: string;
    city: string;
    address: string;
  };
  administrator: {
    fullName: string;
    position: string;
    email: string;
    phone: string;
    password: string;
  };
}

export interface RegistrationResponse {
  success: boolean;
  reference: string;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export type AuthLoadingState = "idle" | "loading" | "error" | "success";
