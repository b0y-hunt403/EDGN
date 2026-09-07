"use client";

import { ShieldCheck, UserRoundCog, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { useDemo } from "@/store/demo-store";

export function BankRolesPage() {
  const { bankRoles } = useDemo();

  return (
    <>
      <PageHeader
        eyebrow="Commercial Bank of Ethiopia · User management"
        title="Bank roles"
        description="Role definitions governing who can create, review, approve, and sign guarantee records."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Defined roles" value={String(bankRoles.length)} icon={UserRoundCog} tone="navy" />
        <StatCard label="Assigned users" value={String(bankRoles.reduce((sum, role) => sum + role.userCount, 0))} icon={Users} tone="teal" />
        <StatCard label="Segregation" value="Enforced" icon={ShieldCheck} tone="amber" helper="Maker ≠ checker ≠ approver" />
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {bankRoles.map((role) => (
          <Card key={role.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{role.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400">{role.id}</p>
                </div>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                  {role.userCount} users
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{role.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-md bg-[#0f6f68]/10 px-2 py-0.5 text-[11px] font-semibold text-[#0f6f68]"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}