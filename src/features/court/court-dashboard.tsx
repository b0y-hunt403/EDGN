"use client";

import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarClock,
  FileQuestion,
  Gavel,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { useDemo } from "@/store/demo-store";
import type { CourtCase } from "@/types";

export function CourtDashboard() {
  const { courtCases } = useDemo();
  const router = useRouter();
  const columns: DataColumn<CourtCase>[] = [
    {
      key: "case",
      header: "Court case",
      render: (item) => (
        <div>
          <p className="font-mono text-xs font-bold text-[#3d345b]">{item.courtCaseNumber}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.edgnDisputeId}</p>
        </div>
      ),
    },
    {
      key: "parties",
      header: "Parties",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.applicant}</p>
          <p className="mt-0.5 max-w-64 truncate text-[11px] text-slate-400">
            v. {item.beneficiary}
          </p>
        </div>
      ),
    },
    {
      key: "guarantee",
      header: "Guarantee",
      render: (item) => (
        <div>
          <p className="font-mono text-xs text-slate-700">{item.guaranteeReference}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.bank}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "hearing", header: "Next hearing", render: (item) => item.nextHearing },
  ];
  return (
    <>
      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <Scale className="size-5 shrink-0 text-violet-600" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-violet-800">Authorized Judicial Portal</p>
            <p className="mt-0.5 text-xs text-violet-700">Judicial determinations remain with the competent court.</p>
          </div>
        </div>
      </div>
      <PageHeader
        eyebrow="Federal First Instance Court · Commercial Bench"
        title="Judicial case overview"
        description="Authorized referrals, evidence access, information requests, hearings, decisions, and execution follow-up."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active cases"
          value="18"
          helper="4 new referrals"
          icon={BriefcaseBusiness}
          tone="violet"
        />
        <StatCard
          label="Pending information"
          value="6"
          helper="2 responses due today"
          icon={FileQuestion}
          tone="amber"
        />
        <StatCard
          label="Hearings this week"
          value="9"
          helper="Next at 14:00"
          icon={CalendarClock}
          tone="navy"
        />
        <StatCard
          label="Decisions issued MTD"
          value="12"
          helper="All authenticated"
          icon={Gavel}
          tone="teal"
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_340px]">
        <Card className="overflow-hidden">
          <CardHeader title="Priority case queue" description="Assigned cases requiring judicial or administrative attention." />
          <DataTable
            rows={courtCases}
            columns={columns}
            getRowKey={(item) => item.id}
            onRowClick={(item) => router.push("/court/cases/" + item.id)}
          />
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Today's schedule" />
            <CardContent className="space-y-3">
              {[
                ["09:30", "Case management conference", "FFIC-CIV-2026-01842"],
                ["11:00", "Evidence review", "FFIC-CIV-2026-01836"],
                ["14:00", "Judicial hearing", "FFIC-CIV-2026-01819"],
              ].map(([time, title, caseNumber]) => (
                <div key={time} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                  <div className="w-12 shrink-0 font-mono text-xs font-bold text-[#3d345b]">{time}</div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{caseNumber}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="flex gap-3 p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-700" />
              <div>
                <p className="text-xs font-semibold text-emerald-900">
                  Evidence integrity healthy
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  184 case artifacts verified in the last 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
