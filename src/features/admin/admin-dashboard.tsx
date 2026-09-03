"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  Landmark,
  LockKeyhole,
  Network,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DonutChart, VerticalBars } from "@/components/shared/charts";
import { PageHeader } from "@/components/shared/page-header";
import { guaranteeStatusDistribution, monthlyIssuance } from "@/mocks/dashboard";
import { useDemo } from "@/store/demo-store";

export function AdminDashboard() {
  const { organizations, banks, guarantees, integrations, auditLogs } = useDemo();
  return (
    <>
      <PageHeader
        eyebrow="EDGN platform operations"
        title="Network operations overview"
        description="System health, institutional participation, guarantee registry, integration, and security posture."
        actions={
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500" />
            All core demo services operational
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active organizations"
          value={String(organizations.length + 173)}
          change="12 onboarded this month"
          trend="up"
          icon={Building2}
          tone="navy"
        />
        <StatCard
          label="Participating banks"
          value={String(banks.length)}
          helper="5 live · 1 maintenance"
          icon={Landmark}
          tone="teal"
        />
        <StatCard
          label="Active guarantees"
          value="4,862"
          helper="ETB 8.74B registered value"
          icon={ShieldCheck}
          tone="teal"
        />
        <StatCard
          label="Open exceptions"
          value="7"
          helper="1 high-priority integration issue"
          icon={AlertTriangle}
          tone="rose"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card>
          <CardHeader title="Monthly issuance trend" description="Successfully issued registry records." />
          <CardContent>
            <VerticalBars data={monthlyIssuance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Guarantees by status" />
          <CardContent>
            <DonutChart
              data={guaranteeStatusDistribution}
              centerLabel="Registry"
              centerValue="4,862"
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader
            title="Integration health"
            action={
              <Link href="/admin/integrations" className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f6f68]">
                Open monitor <ArrowRight className="size-3" />
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {integrations.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Network className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {item.category} · {item.latency}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader
            title="Recent security & audit activity"
            action={
              <Link href="/admin/audit" className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f6f68]">
                View audit <ArrowRight className="size-3" />
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                <div
                  className={
                    "flex size-9 items-center justify-center rounded-lg " +
                    (item.result === "Denied"
                      ? "bg-rose-50 text-rose-700"
                      : item.result === "Warning"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700")
                  }
                >
                  {item.result === "Denied" ? (
                    <LockKeyhole className="size-4" />
                  ) : item.result === "Warning" ? (
                    <ServerCog className="size-4" />
                  ) : (
                    <Activity className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900">{item.action}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {item.actor} · {item.timestamp}
                  </p>
                </div>
                <StatusBadge status={item.result} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
