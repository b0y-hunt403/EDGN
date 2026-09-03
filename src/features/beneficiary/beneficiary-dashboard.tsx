"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarClock,
  FileWarning,
  QrCode,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Guarantee } from "@/types";

export function BeneficiaryDashboard() {
  const { guarantees, claims, disputes, currentUser } = useDemo();
  const router = useRouter();
  const received = guarantees.filter(
    (item) => item.beneficiary === currentUser.organization,
  );
  const totalAmount = received.reduce((sum, item) => sum + item.amount, 0);

  const columns: DataColumn<Guarantee>[] = [
    {
      key: "reference",
      header: "Reference",
      render: (item) => (
        <div>
          <p className="font-mono text-xs font-bold text-[#173b53]">{item.reference}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.bank}</p>
        </div>
      ),
    },
    {
      key: "applicant",
      header: "Applicant",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.applicant}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.type}</p>
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
    { key: "expiry", header: "Expiry", render: (item) => item.expiryDate },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Beneficiary workspace"
        title="Guarantees received by AACRA"
        description="Verify authenticity, monitor coverage, and manage claims and release actions."
        actions={
          <Link href="/beneficiary/verification" className={buttonStyles("primary")}>
            <QrCode className="size-4" />
            Verify guarantee
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active guarantees"
          value={String(received.filter((item) => item.status === "ACTIVE").length + 23)}
          change="3 received this month"
          trend="up"
          icon={ShieldCheck}
          tone="teal"
        />
        <StatCard
          label="Covered amount"
          value={formatMoney(totalAmount + 182_000_000, "ETB", true)}
          helper="Across active contracts"
          icon={ReceiptText}
          tone="navy"
        />
        <StatCard
          label="Expiring in 30 days"
          value="4"
          helper="2 extension decisions due"
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="Open claims & disputes"
          value={String(claims.length + disputes.length)}
          helper="1 court-referred case"
          icon={FileWarning}
          tone="rose"
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_340px]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Recently received guarantees"
            action={
              <Link
                href="/beneficiary/guarantees"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f6f68]"
              >
                View registry <ArrowRight className="size-3" />
              </Link>
            }
          />
          <DataTable
            rows={received}
            columns={columns}
            getRowKey={(item) => item.id}
            onRowClick={(item) =>
              router.push("/beneficiary/guarantees/" + item.id)
            }
          />
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Priority actions" />
            <CardContent className="space-y-3">
              <Link
                href="/beneficiary/claims"
                className="block rounded-lg border border-rose-200 bg-rose-50/50 p-4 hover:bg-rose-50"
              >
                <p className="text-xs font-semibold text-rose-900">
                  Claim response due
                </p>
                <p className="mt-1 text-[11px] leading-5 text-rose-700">
                  CLM-2026-00184 · bank review closes 04 September
                </p>
              </Link>
              <Link
                href="/beneficiary/extensions"
                className="block rounded-lg border border-amber-200 bg-amber-50/50 p-4 hover:bg-amber-50"
              >
                <p className="text-xs font-semibold text-amber-900">
                  Extension decision
                </p>
                <p className="mt-1 text-[11px] leading-5 text-amber-700">
                  EDGN-2026-004867 expires in 8 days
                </p>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Verification activity" />
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#eaf5f2] text-[#0f6f68]">
                  <QrCode className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-950">184</p>
                  <p className="text-xs text-slate-500">QR checks this month</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                All verified records matched a signed EDGN registry version.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
