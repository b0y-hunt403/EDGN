"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/shared/states";
import { useDemo } from "@/store/demo-store";
import type { CourtCase } from "@/types";

export function CourtCaseList() {
  const { courtCases, addToast } = useDemo();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const router = useRouter();
  const rows = useMemo(
    () =>
      courtCases.filter(
        (item) =>
          [
            item.courtCaseNumber,
            item.edgnDisputeId,
            item.applicant,
            item.beneficiary,
            item.guaranteeReference,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === "all" || item.status === status),
      ),
    [courtCases, query, status],
  );
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
      header: "Applicant / beneficiary",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.applicant}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.beneficiary}</p>
        </div>
      ),
    },
    {
      key: "guarantee",
      header: "Guarantee / claim",
      render: (item) => (
        <div>
          <p className="font-mono text-xs text-slate-700">{item.guaranteeReference}</p>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">{item.claimReference}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "officer", header: "Assigned officer", render: (item) => item.assignedOfficer },
    { key: "hearing", header: "Next event", render: (item) => item.nextHearing },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Judicial registry"
        title="Case queue"
        description="Case-based access to authorized guarantee disputes and evidence."
        actions={
          <Button
            variant="outline"
            onClick={() => addToast("Case list exported", "The authorized case scope was applied.", "info")}
          >
            <Download className="size-4" />
            Export docket
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          filters={[
            {
              ariaLabel: "Case status",
              value: status,
              onChange: setStatus,
              options: [
                { label: "All statuses", value: "all" },
                { label: "Active", value: "ACTIVE" },
                { label: "Information requested", value: "INFORMATION_REQUESTED" },
                { label: "Decision draft", value: "DECISION_DRAFT" },
                { label: "Decision issued", value: "DECISION_ISSUED" },
              ],
            },
          ]}
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          onRowClick={(item) => router.push("/court/cases/" + item.id)}
          empty={<EmptyState />}
        />
        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <Scale className="size-3.5 text-[#3d345b]" />
          Access is limited to assigned judicial cases
        </div>
      </Card>
    </>
  );
}
