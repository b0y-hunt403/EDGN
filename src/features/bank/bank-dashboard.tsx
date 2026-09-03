"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CircleDollarSign,
  ClipboardCheck,
  FileClock,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { DonutChart, BarChart } from "@/components/shared/charts";
import { PageHeader } from "@/components/shared/page-header";
import { guaranteeTypeDistribution, bankExposure } from "@/mocks/dashboard";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Application } from "@/types";

export function BankDashboard() {
  const { role, applications, guarantees, claims } = useDemo();
  const router = useRouter();
  const roleConfig =
    role === "bank-checker"
      ? {
          title: "Credit approval overview",
          description: "Review prepared guarantee applications and approval exposure.",
          queue: "Approval queue",
          queueHref: "/bank/approvals",
          statuses: ["PENDING_CHECKER"],
        }
      : role === "bank-signatory"
        ? {
            title: "Authorization overview",
            description: "Review approved guarantee records awaiting final signature.",
            queue: "Signature queue",
            queueHref: "/bank/signatures",
            statuses: ["APPROVED", "PENDING_SIGNATURE"],
          }
        : {
            title: "Guarantee operations overview",
            description: "Prioritized maker work, applicant information, and SLA attention.",
            queue: "Open work queue",
            queueHref: "/bank/work-queue",
            statuses: ["SUBMITTED", "UNDER_REVIEW", "MORE_INFORMATION_REQUIRED"],
          };
  const queue = applications.filter((item) => roleConfig.statuses.includes(item.status));

  const columns: DataColumn<Application>[] = [
    {
      key: "reference",
      header: "Application",
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs font-bold text-[#173b53]">{item.reference}</p>
            <PriorityBadge priority={item.priority} />
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.type}</p>
        </div>
      ),
    },
    {
      key: "applicant",
      header: "Applicant / beneficiary",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.applicant}</p>
          <p className="mt-0.5 max-w-60 truncate text-[11px] text-slate-400">
            {item.beneficiary}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span className="font-mono text-xs font-semibold">{formatMoney(item.amount)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "sla",
      header: "SLA",
      render: (item) => (
        <span
          className={
            "text-xs font-semibold " +
            (item.sla.startsWith("00") || item.sla.startsWith("01")
              ? "text-rose-700"
              : "text-slate-600")
          }
        >
          {item.sla}
        </span>
      ),
    },
  ];

  const routeFor = (item: Application) =>
    role === "bank-checker"
      ? "/bank/applications/" + item.id + "/checker"
      : role === "bank-signatory"
        ? "/bank/applications/" + item.id + "/sign"
        : "/bank/applications/" + item.id + "/maker";

  return (
    <>
      <PageHeader
        eyebrow="Commercial Bank of Ethiopia · Guarantee Operations"
        title={roleConfig.title}
        description={roleConfig.description}
        actions={
          <Link href={roleConfig.queueHref} className={buttonStyles("primary")}>
            <ListChecks className="size-4" />
            {roleConfig.queue}
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Applications awaiting review"
          value="17"
          helper="5 high priority"
          icon={ListChecks}
          tone="navy"
        />
        <StatCard
          label="Pending checker approval"
          value="8"
          helper="ETB 42.6M total"
          icon={ClipboardCheck}
          tone="amber"
        />
        <StatCard
          label="Pending signatures"
          value="5"
          helper="1 SLA due in 48 min"
          icon={Stamp}
          tone="rose"
        />
        <StatCard
          label="Active guarantees"
          value="1,284"
          change="3.4% vs last month"
          trend="up"
          icon={ShieldCheck}
          tone="teal"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_340px]">
        <Card className="overflow-hidden">
          <CardHeader
            title={roleConfig.queue}
            description="Highest-priority records for your current demonstration role."
            action={
              <Link
                href={roleConfig.queueHref}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f6f68]"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            }
          />
          <DataTable
            rows={(queue.length ? queue : applications).slice(0, 5)}
            columns={columns}
            getRowKey={(item) => item.id}
            onRowClick={(item) => router.push(routeFor(item))}
          />
        </Card>
        <Card>
          <CardHeader title="Operational attention" />
          <CardContent className="space-y-3">
            {[
              {
                title: "Signature SLA approaching",
                detail: "APP-2026-00937 · 48 minutes",
                icon: FileClock,
                tone: "bg-rose-50 text-rose-700",
              },
              {
                title: "Collateral response pending",
                detail: "3 requests awaiting core confirmation",
                icon: CircleDollarSign,
                tone: "bg-amber-50 text-amber-700",
              },
              {
                title: "Claims awaiting decision",
                detail: claims.length + " active claim records",
                icon: ReceiptText,
                tone: "bg-blue-50 text-blue-700",
              },
              {
                title: "Adapter latency alert",
                detail: "Bank of Abyssinia · 1.4 s",
                icon: AlertTriangle,
                tone: "bg-violet-50 text-violet-700",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                <div className={"flex size-9 shrink-0 items-center justify-center rounded-lg " + item.tone}>
                  <item.icon className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Outstanding exposure by type" />
          <CardContent>
            <DonutChart
              data={guaranteeTypeDistribution}
              centerLabel="Total"
              centerValue="ETB 2.86B"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Network exposure comparison" description="Top participating banks in the demo registry." />
          <CardContent>
            <BarChart data={bankExposure} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
