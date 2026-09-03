"use client";

import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/store/demo-store";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { formatMoney, humanizeStatus } from "@/lib/utils";
import type { Application } from "@/types";

export default function ApplicantApplicationsPage() {
  const { applications } = useDemo();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = applications.filter((app) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      app.reference.toLowerCase().includes(q) ||
      app.contractTitle.toLowerCase().includes(q) ||
      app.beneficiary.toLowerCase().includes(q) ||
      app.applicant.toLowerCase().includes(q);
    const matchesStatus = status === "all" || app.status === status;
    return matchesQ && matchesStatus;
  });

  return (
    <>
      <PageHeader
        eyebrow="Bank guarantees"
        title="Applications"
        description="Track requisitions created by your organization."
        actions={
          <Link href="/applicant/applications/new">
            <Button>
              <FilePlus2 className="size-4" />
              New guarantee
            </Button>
          </Link>
        }
      />

      <Card>
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search reference, contract, beneficiary…"
          filters={[
            {
              ariaLabel: "Filter by status",
              value: status,
              onChange: setStatus,
              options: [
                { label: "All statuses", value: "all" },
                ...Array.from(new Set(applications.map((a) => a.status))).map(
                  (s) => ({ label: humanizeStatus(s), value: s }),
                ),
              ],
            },
          ]}
        />
        <DataTable<Application>
          rows={filtered}
          getRowKey={(a) => a.id}
          onRowClick={(a) => {
            window.location.href = "/applicant/applications/" + a.id;
          }}
          empty={
            <EmptyState
              title="No applications match"
              description="Adjust the filters or create a new guarantee request."
            />
          }
          columns={[
            {
              key: "reference",
              header: "Reference",
              render: (a) => (
                <span className="font-mono text-xs font-semibold text-[#0f6f68]">
                  {a.reference}
                </span>
              ),
            },
            {
              key: "contract",
              header: "Contract",
              render: (a) => (
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {a.contractTitle}
                  </p>
                  <p className="text-[11px] text-slate-500">{a.contractReference}</p>
                </div>
              ),
            },
            {
              key: "beneficiary",
              header: "Beneficiary",
              render: (a) => <span className="text-sm text-slate-700">{a.beneficiary}</span>,
            },
            {
              key: "type",
              header: "Type",
              render: (a) => <span className="text-xs text-slate-600">{a.type}</span>,
            },
            {
              key: "amount",
              header: "Amount",
              render: (a) => (
                <span className="text-sm font-semibold text-slate-800">{formatMoney(a.amount)}</span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (a) => <StatusBadge status={a.status} />,
            },
            {
              key: "sla",
              header: "SLA",
              render: (a) => <span className="text-xs text-slate-600">{a.sla}</span>,
            },
          ]}
        />
      </Card>
    </>
  );
}