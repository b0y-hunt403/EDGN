"use client";

import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  Download,
  FileClock,
  Gavel,
  History,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart, DonutChart, VerticalBars } from "@/components/shared/charts";
import {
  bankExposure,
  guaranteeTypeDistribution,
  monthlyIssuance,
} from "@/mocks/dashboard";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";

export type BankOperationsView =
  | "collateral"
  | "alerts"
  | "instructions"
  | "exposure"
  | "reports"
  | "history";

export function BankOperationsPage({ view }: { view: BankOperationsView }) {
  const { applications, integrations, guarantees, addToast } = useDemo();

  if (view === "reports" || view === "exposure") {
    return (
      <>
        <PageHeader
          eyebrow="Risk & reporting"
          title={view === "exposure" ? "Contract exposure" : "Guarantee reporting"}
          description="Operational portfolio analytics using the role-authorized demonstration dataset."
          actions={
            <Button
              variant="outline"
              onClick={() =>
                addToast(
                  "Report generated",
                  "A presentation-ready scoped report is available.",
                  "info",
                )
              }
            >
              <Download className="size-4" />
              Export report
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Outstanding exposure", "ETB 2.86B", "+1.8% this week"],
            ["Guarantees issued MTD", "312", "On pace with August"],
            ["Flagged for review", "5", "Requires risk sign-off"],
          ].map(([label, value, helper]) => (
            <Card key={label} className="p-5">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
              <p className="mt-2 text-xs text-slate-500">{helper}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader title="Exposure by guarantee type" />
            <CardContent>
              <DonutChart
                data={guaranteeTypeDistribution}
                centerLabel="Exposure"
                centerValue="2.86B"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Exposure by participating bank" />
            <CardContent>
              <BarChart data={bankExposure} />
            </CardContent>
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader title="Monthly guarantee issuance" />
            <CardContent>
              <VerticalBars data={monthlyIssuance} />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (view === "collateral") {
    return (
      <>
        <PageHeader
          eyebrow="Collateral & reserve"
          title="Collateral coordination"
          description="Track reserve requests and confirmations. The bank core remains the financial system of record."
          actions={
            <Button variant="outline">
              <RefreshCw className="size-4" />
              Reconcile
            </Button>
          }
        />
        <div className="grid gap-4">
          {applications.slice(0, 5).map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <CircleDollarSign className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs font-bold text-[#173b53]">{item.reference}</p>
                    <StatusBadge status={item.collateralStatus} />
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900">
                    {item.applicant} · {formatMoney(item.amount)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Core reference {item.collateralStatus === "Reserved" ? "CBE-RSV-883164" : "Pending assignment"}
                  </p>
                </div>
                <Button variant="outline" size="sm">View reserve</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (view === "instructions") {
    return (
      <>
        <PageHeader
          eyebrow="Authorized judicial communication"
          title="Court instructions"
          description="Authenticated instructions are recorded separately from bank execution status."
        />
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex size-11 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <Gavel className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <p className="font-mono text-xs font-bold text-[#173b53]">JIN-2026-00071</p>
                  <StatusBadge status="ACKNOWLEDGED" />
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  Preserve claim settlement pending authenticated decision
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  FFIC-CIV-2026-01788 · EDGN-2026-004612 · received 29 Aug 2026
                </p>
              </div>
              <div className="text-xs">
                <p className="text-slate-400">Execution status</p>
                <p className="mt-1 font-semibold text-slate-800">Action recorded · evidence pending</p>
              </div>
              <Button variant="outline">Open instruction</Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (view === "history") {
    return (
      <>
        <PageHeader
          eyebrow="Authorization history"
          title="Approval & issuance history"
          description="A traceable view of completed bank decisions and issued guarantee records."
        />
        <Card className="overflow-hidden">
          {guarantees.slice(0, 7).map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <BadgeCheck className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-bold text-[#173b53]">{item.reference}</p>
                <p className="mt-1 text-xs text-slate-500">{item.applicant} · {item.type}</p>
              </div>
              <p className="hidden text-xs text-slate-500 sm:block">{item.issueDate}</p>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </Card>
      </>
    );
  }

  const alerts = [
    {
      title: "Signature SLA approaching",
      detail: "APP-2026-00937 must be signed within 48 minutes.",
      severity: "High",
      icon: FileClock,
    },
    {
      title: "Integration latency above threshold",
      detail: integrations.find((item) => item.status === "Degraded")?.name + " is responding in 1.4 s.",
      severity: "Medium",
      icon: AlertTriangle,
    },
    {
      title: "Potential duplicate contract reference",
      detail: "MOTRI/PROC/NCB/2026/077 matched a prior inactive application.",
      severity: "Medium",
      icon: ShieldAlert,
    },
    {
      title: "Collateral reconciliation complete",
      detail: "All CBE reserve confirmations matched this morning.",
      severity: "Information",
      icon: CheckCircle2,
    },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Operations monitoring"
        title="Operational alerts"
        description="SLA, integration, fraud, collateral, and workflow attention requiring bank action."
      />
      <div className="grid gap-4">
        {alerts.map((item) => (
          <Card key={item.title}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div
                className={
                  "flex size-11 items-center justify-center rounded-lg " +
                  (item.severity === "High"
                    ? "bg-rose-50 text-rose-700"
                    : item.severity === "Medium"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700")
                }
              >
                <item.icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              </div>
              <StatusBadge status={item.severity} label={item.severity} />
              <Button variant="outline" size="sm">Review alert</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
