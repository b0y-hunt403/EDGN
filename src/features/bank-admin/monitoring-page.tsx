"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, ShieldCheck, Stamp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DonutChart, BarChart } from "@/components/shared/charts";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";

export function GuaranteeMonitoring() {
  const { guarantees } = useDemo();

  const byStatus = {
    ACTIVE: guarantees.filter((g) => g.status === "ACTIVE").length,
    PENDING_APPROVAL: guarantees.filter((g) => g.status === "PENDING_APPROVAL").length,
    PENDING_SIGNATURE: guarantees.filter((g) => g.status === "PENDING_SIGNATURE").length,
    EXPIRING_SOON: guarantees.filter((g) => g.status === "EXPIRING_SOON").length,
  };
  const total = Math.max(guarantees.length, 1);
  const exposure = guarantees
    .filter((g) => g.status === "ACTIVE" || g.status === "EXPIRING_SOON")
    .reduce((sum, g) => sum + g.amount, 0);

  const donutData = [
    { label: "Active", value: Math.round((byStatus.ACTIVE / total) * 100), color: "#0f6f68" },
    { label: "Pending approval", value: Math.round((byStatus.PENDING_APPROVAL / total) * 100), color: "#f59e0b" },
    { label: "Pending signature", value: Math.round((byStatus.PENDING_SIGNATURE / total) * 100), color: "#173b53" },
    { label: "Expiring soon", value: Math.round((byStatus.EXPIRING_SOON / total) * 100), color: "#e11d48" },
  ].filter((item) => item.value > 0);

  const byType = useMemo(() => {
    const counts: Record<string, number> = {};
    guarantees.forEach((g) => {
      counts[g.type] = (counts[g.type] ?? 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [guarantees]);

  const recent = [...guarantees].slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Commercial Bank of Ethiopia · Monitoring"
        title="Guarantee monitoring"
        description="Live portfolio state and issuance pipeline for the connected demo bank."
        actions={
          <Link href="/bank/registry" className={buttonStyles("outline")}>
            <ShieldCheck className="size-4" />
            Open registry
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Guarantees in force" value={String(byStatus.ACTIVE)} icon={ShieldCheck} tone="teal" helper="Active instruments" />
        <StatCard label="Total exposure" value={formatMoney(exposure)} icon={Activity} tone="navy" helper="Active + expiring" />
        <StatCard label="Awaiting approval" value={String(byStatus.PENDING_APPROVAL + byStatus.PENDING_SIGNATURE)} icon={Stamp} tone="amber" helper="Pipeline attention" />
        <StatCard label="Expiring soon" value={String(byStatus.EXPIRING_SOON)} icon={AlertTriangle} tone="rose" helper="Within 90 days" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Status distribution" description="Share of the guarantee book by workflow state." />
          <CardContent className="p-6">
            <DonutChart
              data={donutData}
              centerLabel="Guarantees"
              centerValue={String(guarantees.length)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="By guarantee type" description="Issued instruments per product line." />
          <CardContent className="p-6">
            <BarChart data={byType} />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader title="Recent activity" description="Latest signed and registered instruments." />
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={"/bank/guarantees/" + item.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-bold text-[#173b53]">{item.reference}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {item.applicant} · {item.beneficiary}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold">{formatMoney(item.amount)}</span>
                <StatusBadge status={item.status} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}