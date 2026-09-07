"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Clock3, FileClock, GitBranch, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Application, Guarantee } from "@/types";

export function PendingActionsPage() {
  const { guarantees, applications } = useDemo();

  const pendingGuarantees = useMemo(
    () => guarantees.filter((g) => g.status === "PENDING_APPROVAL" || g.status === "PENDING_SIGNATURE"),
    [guarantees],
  );
  const pendingApps = useMemo(
    () =>
      applications.filter((a) =>
        ["PENDING_CHECKER", "PENDING_APPROVER", "MORE_INFORMATION_REQUIRED"].includes(a.status),
      ),
    [applications],
  );

  const renderGuaranteeRow = (item: Guarantee) => (
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
  );

  const renderApplicationRow = (item: Application) => (
    <Link
      key={item.id}
      href={
        item.status === "PENDING_CHECKER"
          ? "/bank/applications/" + item.id + "/checker"
          : item.status === "PENDING_APPROVER"
            ? "/bank/applications/" + item.id + "/sign"
            : "/bank/applications/" + item.id + "/maker"
      }
      className="flex flex-wrap items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs font-bold text-[#173b53]">{item.reference}</p>
          <PriorityBadge priority={item.priority} />
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {item.applicant} · {item.type} · {item.sla}
        </p>
      </div>
      <span className="font-mono text-xs font-semibold">{formatMoney(item.amount)}</span>
      <StatusBadge status={item.status} />
    </Link>
  );

  return (
    <>
      <PageHeader
        eyebrow="Commercial Bank of Ethiopia · Bank admin"
        title="Pending actions"
        description="Records across the bank that require a decision or review from guarantee operations."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Guarantees pending" value={String(pendingGuarantees.length)} icon={ShieldAlert} tone="amber" />
        <StatCard label="Applications pending" value={String(pendingApps.length)} icon={GitBranch} tone="navy" />
        <StatCard label="Signature requests" value={String(guarantees.filter((g) => g.status === "PENDING_SIGNATURE").length)} icon={FileClock} tone="teal" />
        <StatCard label="SLA urgent" value="2" icon={Clock3} tone="rose" helper="Within 2 hours" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Guarantee approval pipeline"
            description="Instruments awaiting approval or signature."
            action={
              <Link href="/bank/registry" className={buttonStyles("ghost")}>
                View registry
              </Link>
            }
          />
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {pendingGuarantees.map(renderGuaranteeRow)}
              {pendingGuarantees.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">No pending guarantees.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Application reviews"
            description="Maker, checker, and approver queues that need attention."
          />
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {pendingApps.map(renderApplicationRow)}
              {pendingApps.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">No pending applications.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}