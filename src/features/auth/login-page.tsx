"use client";

/*
 * MOCK AUTHENTICATION — DEMO ONLY
 * Login page for the EDGN presentation.
 */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  LoaderCircle,
  ChevronDown,
  ChevronUp,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/store/auth-store";
import { demoAccounts } from "@/mocks/demo-accounts";
import { roleHome } from "@/config/roles";
import { cn } from "@/lib/utils";
import type { DemoRoleId } from "@/types";

export function LoginPage() {
  const router = useRouter();
  const { login, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password, rememberMe });
      const account = demoAccounts.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
      );
      const targetRole = account?.roleId ?? "applicant";
      router.push(roleHome[targetRole]);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDemoAccountClick(roleId: DemoRoleId) {
    const account = demoAccounts.find((a) => a.roleId === roleId);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setFieldErrors({});
      clearError();
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden w-[440px] shrink-0 flex-col justify-between bg-[#162f3d] p-10 xl:flex">
        <div>
          <Link href="/login" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[10px] border border-white/15 bg-white/10 text-[#62d2bd]">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-[0.12em] text-white">EDGN</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                Digital Guarantee Network
              </p>
            </div>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold leading-8 text-white">
              Welcome to the
              <br />
              Ethiopian Digital
              <br />
              Guarantee Network
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              A secure, transparent platform for managing bank guarantees across
              Ethiopia&apos;s financial ecosystem.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Multi-bank guarantee lifecycle management",
              "Real-time verification and audit trails",
              "Secure digital signing and issuance",
              "Court integration for dispute resolution",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div className="mt-0.5 size-5 shrink-0 rounded-full bg-[#62d2bd]/15 flex items-center justify-center">
                  <div className="size-1.5 rounded-full bg-[#62d2bd]" />
                </div>
                <span className="text-sm text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          &copy; 2026 EDGN Authority. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 xl:hidden">
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#162f3d] text-[#62d2bd]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-[0.12em] text-slate-900">EDGN</p>
              <p className="text-[9px] uppercase tracking-[0.14em] text-slate-500">
                Digital Guarantee Network
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-950">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access the EDGN platform.
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Email address <span className="ml-1 text-rose-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="you@organization.et"
                autoComplete="email"
                disabled={isSubmitting}
                className={cn(
                  "h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500",
                  fieldErrors.email
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                )}
              />
              {fieldErrors.email ? (
                <p className="mt-1.5 text-xs text-rose-600">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Password <span className="ml-1 text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className={cn(
                    "h-11 w-full rounded-lg border bg-white px-3.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500",
                    fieldErrors.password
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="mt-1.5 text-xs text-rose-600">{fieldErrors.password}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-slate-300 accent-[#0f6f68]"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#0f6f68] hover:text-[#0b5f59]"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-[#0f6f68] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6f68]/30 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#0f6f68] hover:text-[#0b5f59]"
            >
              Get started
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={() => setShowDemoAccounts((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-left transition hover:border-[#0f6f68]/30 hover:bg-[#0f6f68]/5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#e7f4f1] text-[#0f6f68]">
                  <UsersRound className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#0f6f68]">
                    Demo Accounts
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Quick access for presentation
                  </p>
                </div>
              </div>
              {showDemoAccounts ? (
                <ChevronUp className="size-4 text-slate-400" />
              ) : (
                <ChevronDown className="size-4 text-slate-400" />
              )}
            </button>

            {showDemoAccounts ? (
              <div className="mt-3 space-y-1.5">
                {demoAccounts.map((account) => (
                  <button
                    key={account.roleId}
                    type="button"
                    onClick={() => handleDemoAccountClick(account.roleId)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition hover:border-[#0f6f68]/20 hover:bg-[#f2f9f7]",
                      email === account.email && "border-[#0f6f68]/30 bg-[#f2f9f7]",
                    )}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#173b53] text-[10px] font-bold text-white">
                      {account.label.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">
                        {account.label}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {account.email}
                      </p>
                    </div>
                    <ArrowRight className="size-3.5 shrink-0 text-slate-300" />
                  </button>
                ))}
                <p className="pt-2 text-center text-[10px] text-slate-400">
                  Password: Demo@123
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
