"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Download, ReceiptText, ShieldX, Stamp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Claim, ClaimStatus } from "@/types";

const statusCount = (items: Claim[], status: ClaimStatus) =>
  items.filter((item) => item.status === status).length;
const activeCount = (items: Claim[]) =>
  statusCount(items, "SUBMITTED") +
  statusCount(items, "UNDER_REVIEW") +
  statusCount(items, "DOCUMENT_VERIFICATION");

export function ClaimsWorking({ monitoring = false }: { monitoring?: boolean }) {
  const router = useRouter();
  const { claims, addToast } = useDemo();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [status, setStatus] = useState("any");

  const rows = useMemo(() => {
    const needle = query.toLowerCase();
    return claims.filter((item) => {
      const matchesQuery = [
        item.reference,
        item.guaranteeReference,
        item.beneficiary,
        item.applicant,
        item.reason,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);

      const matchesDropdown = status === "any" || item.status === status;

      let matchesTab = true;
      if (activeTab === "pending") matchesTab = item.status === "SUBMITTED";
      else if (activeTab === "review")
        matchesTab =
          item.status === "UNDER_REVIEW" ||
          item.status === "DOCUMENT_VERIFICATION";
      else if (activeTab === "approved")
        matchesTab =
          item.status === "APPROVED" ||
          item.status === "PAYMENT_PENDING" ||
          item.status === "SETTLED";
      else if (activeTab === "rejected") matchesTab = item.status === "REJECTED";

      return matchesQuery && matchesDropdown && matchesTab;
    });
  }, [claims, query, status, activeTab]);

  const columns: DataColumn<Claim>[] = [
    {
      key: "reference",
      header: "Claim",
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs font-bold text-[#173b53]">{item.reference}</p>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.guaranteeReference}</p>
        </div>
      ),
    },
    {
      key: "beneficiary",
      header: "Beneficiary / applicant",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.beneficiary}</p>
          <p className="mt-0.5 max-w-56 truncate text-[11px] text-slate-400">{item.applicant}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Claim amount",
      render: (item) => (
        <span className="font-mono text-xs font-semibold">{formatMoney(item.amount)}</span>
      ),
    },
    {
      key: "officer",
      header: "Assigned officer",
      render: (item) => (
        <div>
          <p className="text-xs font-medium text-slate-700">{item.assignedOfficer}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">Due {item.dueDate}</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Claim management"
        title={monitoring ? "Claim monitoring" : "Claims decision queue"}
        description={
          monitoring
            ? "Portfolio view of guarantee claims, decisions, and settlement state."
            : "Review beneficiary demands and progress claim decisions against bank SLA."
        }
        actions={
          <Button
            variant="outline"
            onClick={() => addToast("Claims exported", "The claim register is ready for download.", "info")}
          >
            <Download className="size-4" />
            Export register
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active claims" value={String(activeCount(claims))} icon={ReceiptText} tone="amber" helper="Need decision attention" />
        <StatCard label="Approved / payment" value={String(statusCount(claims, "APPROVED") + statusCount(claims, "PAYMENT_PENDING"))} icon={BadgeCheck} tone="navy" />
        <StatCard label="Settled" value={String(statusCount(claims, "SETTLED"))} icon={Stamp} tone="teal" />
        <StatCard label="Rejected" value={String(statusCount(claims, "REJECTED"))} icon={ShieldX} tone="rose" />
      </div>
      {/* Enterprise Claim Workflow Lifecycle Banner */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f6f68]">
              Standardized Enterprise Claim Lifecycle
            </p>
            <p className="text-xs text-slate-500">
              Multi-tier review, evidentiary validation, and bank settlement execution.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">Claim Submitted</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">Initial Review</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">Document Verification</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">Approval / Rejection</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-[#0f6f68]/10 px-2 py-1 font-semibold text-[#0f6f68]">Settlement</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            { value: "all", label: `All Claims (${claims.length})` },
            {
              value: "pending",
              label: `Pending Claims (${statusCount(claims, "SUBMITTED")})`,
            },
            {
              value: "review",
              label: `Under Review (${
                statusCount(claims, "UNDER_REVIEW") +
                statusCount(claims, "DOCUMENT_VERIFICATION")
              })`,
            },
            {
              value: "approved",
              label: `Approved / Settled (${
                statusCount(claims, "APPROVED") +
                statusCount(claims, "PAYMENT_PENDING") +
                statusCount(claims, "SETTLED")
              })`,
            },
            {
              value: "rejected",
              label: `Rejected Claims (${statusCount(claims, "REJECTED")})`,
            },
          ]}
        />
      </div>

      <Card className="mt-3 overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          filters={[
            {
              ariaLabel: "Claim status",
              value: status,
              onChange: setStatus,
              options: [
                { label: "Any status", value: "any" },
                { label: "Submitted", value: "SUBMITTED" },
                { label: "Under review", value: "UNDER_REVIEW" },
                { label: "Document verification", value: "DOCUMENT_VERIFICATION" },
                { label: "Approved", value: "APPROVED" },
                { label: "Payment pending", value: "PAYMENT_PENDING" },
                { label: "Settled", value: "SETTLED" },
                { label: "Rejected", value: "REJECTED" },
              ],
            },
          ]}
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          onRowClick={(item) => router.push("/bank/claims/" + item.id)}
          empty={
            <EmptyState
              title="No claims found"
              description="No claims match the current filter."
            />
          }
        />
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {rows.length} claims · {activeCount(claims)} active · decision SLA tracked per claim
        </div>
      </Card>
    </>
  );
}