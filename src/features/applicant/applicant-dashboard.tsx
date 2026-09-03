"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  FileEdit,
  FilePlus2,
  MessageSquareWarning,
  ReceiptText,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Timeline } from "@/components/shared/timeline";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Guarantee } from "@/types";

export function ApplicantDashboard() {
  const { currentUser, language, guarantees, applications, claims, disputes } =
    useDemo();
  const router = useRouter();
  const applicantGuarantees = guarantees.filter(
    (item) => item.applicant === currentUser.organization,
  );
  const applicantApplications = applications.filter(
    (item) => item.applicant === currentUser.organization,
  );
  const active = applicantGuarantees.filter((item) => item.status === "ACTIVE");
  const pendingTasks = applicantApplications.filter((item) =>
    ["DRAFT", "MORE_INFORMATION_REQUIRED"].includes(item.status),
  );
  const expiring = applicantGuarantees.filter(
    (item) => item.status === "EXPIRING_SOON",
  );

  const columns: DataColumn<Guarantee>[] = [
    {
      key: "reference",
      header: "Reference",
      render: (item) => (
        <div>
          <p className="font-mono text-xs font-bold text-[#173b53]">
            {item.reference}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.bank}</p>
        </div>
      ),
    },
    {
      key: "beneficiary",
      header: "Beneficiary",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.beneficiary}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {item.contractReference}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => item.type,
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {formatMoney(item.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "expiry",
      header: "Expiry",
      render: (item) => item.expiryDate,
    },
  ];

  const latestTimeline =
    applicantGuarantees[0]?.timeline.slice(0, 3) ??
    applicantApplications[0]?.timeline.slice(0, 3) ??
    [];

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f6f68]">
            {language === "am" ? "እንኳን ደህና መጡ" : "Good morning"}
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-[28px]">
            Guarantee portfolio
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Meskel Construction PLC · Tuesday, 1 September 2026
          </p>
        </div>
        <Link
          href="/applicant/applications/new"
          className={buttonStyles("primary", "lg")}
        >
          <FilePlus2 className="size-4" />
          New guarantee request
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active guarantees"
          value={String(active.length + 7)}
          change="2 issued this quarter"
          trend="up"
          icon={ShieldCheck}
          tone="teal"
        />
        <StatCard
          label="Pending tasks"
          value={String(pendingTasks.length)}
          helper="1 draft needs completion"
          icon={FileEdit}
          tone="amber"
        />
        <StatCard
          label="Expiring in 30 days"
          value={String(expiring.length + 1)}
          helper="Review extension needs"
          icon={Timer}
          tone="rose"
        />
        <StatCard
          label="Active exposure"
          value="ETB 18.95M"
          change="Within approved threshold"
          trend="neutral"
          icon={ReceiptText}
          tone="navy"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Guarantee portfolio"
            description="Recently updated guarantees and lifecycle activity."
            action={
              <Link
                href="/applicant/guarantees"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f6f68] hover:underline"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            }
          />
          <DataTable
            rows={applicantGuarantees.slice(0, 5)}
            columns={columns}
            getRowKey={(item) => item.id}
            onRowClick={(item) =>
              router.push("/applicant/guarantees/" + item.id)
            }
            compact
          />
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader title="Tasks requiring attention" />
            <CardContent className="space-y-3">
              <Link
                href="/applicant/applications/new"
                className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3 transition hover:bg-amber-50"
              >
                <FileEdit className="mt-0.5 size-4 shrink-0 text-amber-700" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Complete performance guarantee draft
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    APP-2026-00942 · bank selection and review remain
                  </p>
                </div>
              </Link>
              <Link
                href="/applicant/claims"
                className="flex gap-3 rounded-lg border border-rose-200 bg-rose-50/50 p-3 transition hover:bg-rose-50"
              >
                <MessageSquareWarning className="mt-0.5 size-4 shrink-0 text-rose-700" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Respond to claim review
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    {claims[0]?.id} · response due 4 September
                  </p>
                </div>
              </Link>
              <Link
                href="/applicant/disputes"
                className="flex gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-slate-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Court information request
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    {disputes[0]?.caseNumber} · authorized response requested
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title="Latest activity"
              action={<Bell className="size-4 text-slate-400" />}
            />
            <CardContent>
              <Timeline events={latestTimeline} compact />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
