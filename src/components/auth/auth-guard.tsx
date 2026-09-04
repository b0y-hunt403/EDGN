"use client";

/*
 * MOCK AUTHENTICATION GUARD — DEMO ONLY
 *
 * Frontend-only route protection for presentation purposes.
 * Production must enforce real server-side authentication and authorization.
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/store/auth-store";
import { LoadingState } from "@/components/shared/states";

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password", "/verify", "/verify/help"];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router]);

  if (isLoading) {
    return <LoadingState full />;
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
