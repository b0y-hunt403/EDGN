"use client";

/*
 * MOCK AUTHENTICATION — DEMO ONLY
 * Forgot password page for the EDGN presentation.
 */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/store/auth-store";

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center gap-3">
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

        {submitted ? (
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Mail className="size-8" />
            </div>
            <h1 className="mt-6 text-xl font-bold text-slate-950">Check your email</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              If an account exists for{" "}
              <span className="font-semibold text-slate-700">{email}</span>, a password
              reset link has been sent. Please check your inbox.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="size-4 shrink-0" />
              Reset email sent successfully
            </div>
            <Link
              href="/login"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-950">Reset your password</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter the email address associated with your EDGN account and we&apos;ll send
              you a link to reset your password.
            </p>

            {error ? (
              <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Email address <span className="ml-1 text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@organization.et"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f6f68] focus:ring-2 focus:ring-[#0f6f68]/10 disabled:bg-slate-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-[#0f6f68] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6f68]/30 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#0f6f68] hover:text-[#0b5f59]"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
