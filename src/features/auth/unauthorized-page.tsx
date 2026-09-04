"use client";

/*
 * MOCK AUTHENTICATION — DEMO ONLY
 * Unauthorized access page.
 */

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/store/auth-store";
import { roleHome } from "@/config/roles";

export function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-950">Access Denied</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          You don&apos;t have permission to access this portal. Your current role
          ({user?.roleId ? user.roleId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Unknown"}) does not
          include access to this section of the EDGN platform.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {user ? (
            <Link
              href={roleHome[user.roleId]}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-transparent bg-[#0f6f68] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59]"
            >
              <Home className="size-4" />
              Go to my dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-transparent bg-[#0f6f68] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59]"
            >
              <ArrowLeft className="size-4" />
              Sign in with a different account
            </Link>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Need access? Contact your EDGN administrator.
        </p>
      </div>
    </div>
  );
}
