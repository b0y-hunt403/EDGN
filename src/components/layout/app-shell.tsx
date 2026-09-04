"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { RoleGuard } from "@/components/auth/role-guard";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { useDemo } from "@/store/demo-store";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isLoading, error, role, setRole } = useDemo();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const portal = pathname.split("/")[1];
    const expected =
      portal === "beneficiary"
        ? "beneficiary"
        : portal === "admin"
          ? "admin"
          : portal === "court"
            ? "court"
            : portal === "developer"
              ? "developer"
              : portal === "applicant"
                ? "applicant"
                : null;
    if (expected && role !== expected) setRole(expected);
    if (portal === "bank" && !role.startsWith("bank-")) setRole("bank-maker");
  }, [pathname, role, setRole]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RoleGuard>
      <div className="min-h-screen bg-[#f4f6f8]">
        <Sidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
        <div
          className={cn(
            "min-h-screen transition-[margin] duration-200",
            collapsed ? "lg:ml-[76px]" : "lg:ml-[248px]",
          )}
        >
          <Topbar onOpenMenu={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7">
            {isLoading ? (
              <LoadingState full />
            ) : error ? (
              <ErrorState
                description={error}
                onRetry={() => window.location.reload()}
              />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
