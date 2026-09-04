"use client";

/*
 * MOCK ROLE GUARD — DEMO ONLY
 *
 * Frontend-only role-based route protection for presentation purposes.
 * Production must enforce real server-side authorization.
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/store/auth-store";
import { LoadingState } from "@/components/shared/states";

const PORTAL_ROLES: Record<string, string[]> = {
  applicant: ["applicant"],
  beneficiary: ["beneficiary"],
  bank: ["bank-maker", "bank-checker", "bank-signatory"],
  admin: ["admin"],
  court: ["court"],
  developer: ["developer"],
};

export function RoleGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const portal = pathname.split("/")[1];
  const allowedRoles = PORTAL_ROLES[portal];

  const hasAccess = !allowedRoles || !user || allowedRoles.includes(user.roleId);

  useEffect(() => {
    if (isAuthenticated && !hasAccess) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, hasAccess, router]);

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
