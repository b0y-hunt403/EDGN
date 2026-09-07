"use client";

import { KeyRound, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { bankRoles } from "@/mocks/roles-config";

export function BankPermissionsPage() {
  const modules: { label: string; actions: string[] }[] = [
    { label: "Guarantee requests", actions: ["create", "read", "update", "review", "approve", "sign"] },
    { label: "Applications", actions: ["create", "read", "update", "delete", "review", "approve", "return"] },
    { label: "Documents", actions: ["create", "read", "update", "verify"] },
    { label: "Users & roles", actions: ["create", "read", "update", "delete", "manage"] },
    { label: "Branches & recipients", actions: ["create", "read", "update", "delete"] },
    { label: "Approval matrix & SLA", actions: ["create", "read", "update", "delete"] },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Commercial Bank of Ethiopia · User management"
        title="Role permissions"
        description="Matrix of bank-level permissions by role and module. Non-editable in the prototype."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Permission model" value="ABAC" icon={KeyRound} tone="navy" helper="Attribute-based access control" />
        <StatCard label="Roles enforced" value={String(bankRoles.length)} icon={ShieldCheck} tone="teal" />
        <StatCard label="Modules secured" value={String(modules.length)} icon={SlidersHorizontal} tone="amber" />
      </div>
      <Card className="mt-6">
        <CardHeader
          title="Permission matrix"
          description="Checkmarks indicate granted bank-level permissions in the demo configuration."
        />
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50/90">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.09em] text-slate-500">
                    Module
                  </th>
                  {bankRoles.map((role) => (
                    <th key={role.id} className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.09em] text-slate-500">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map((module) => (
                  <tr key={module.label} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{module.label}</td>
                    {bankRoles.map((role) => {
                      const granted = module.actions.filter((action) =>
                        role.permissions.includes(action) ||
                        role.permissions.includes("manage"),
                      );
                      return (
                        <td key={role.id} className="px-4 py-3 text-center">
                          <span className="inline-flex flex-wrap items-center justify-center gap-1">
                            {granted.length > 0 ? (
                              granted.slice(0, 3).map((action) => (
                                <span
                                  key={action}
                                  className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700"
                                >
                                  {action}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Super admin role retains read-only oversight across all bank configurations.
          </div>
        </CardContent>
      </Card>
    </>
  );
}