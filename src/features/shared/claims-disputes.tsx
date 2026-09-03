"use client";

import { useRouter } from "next/navigation";
import { FileCheck2, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/shared/states";
import { formatMoney } from "@/lib/utils";
import { useState } from "react";
import type { Claim, Dispute } from "@/types";

function useList<T>(items: T[], searchFields: (item: T) => string) {
  const [query, setQuery] = useState("");
  return {
    query,
    setQuery,
    filtered: items.filter((item) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      return searchFields(item).toLowerCase().includes(needle);
    }),
  };
}

export function ClaimsTable({
  claims,
  emptyMessage,
}: {
  claims: Claim[];
  emptyMessage: string;
}) {
  const { query, setQuery, filtered } = useList(claims, (c) =>
    [c.id, c.guaranteeReference, c.beneficiary, c.applicant, c.bank, c.reason].join(" "),
  );
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <SearchAndFilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search claims by reference, guarantee, or party…"
      />
      <DataTable<Claim>
        rows={filtered}
        columns={[
          {
            key: "id",
            header: "Claim",
            render: (c) => (
              <div>
                <p className="font-mono text-xs font-bold text-[#173b53]">{c.id}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{c.guaranteeReference}</p>
              </div>
            ),
          },
          {
            key: "parties",
            header: "Applicant / beneficiary",
            render: (c) => (
              <div>
                <p className="font-semibold text-slate-800">{c.beneficiary}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{c.applicant}</p>
              </div>
            ),
          },
          {
            key: "reason",
            header: "Reason",
            render: (c) => <span className="text-sm text-slate-700">{c.reason}</span>,
          },
          {
            key: "amount",
            header: "Amount",
            render: (c) => (
              <span className="whitespace-nowrap font-mono text-xs font-semibold text-slate-800">
                {formatMoney(c.amount)}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (c) => <StatusBadge status={c.status} />,
          },
          {
            key: "due",
            header: "Due date",
            render: (c) => <span className="text-xs text-slate-600">{c.dueDate}</span>,
          },
        ]}
        getRowKey={(c) => c.id}
        onRowClick={() => undefined}
        empty={
          <EmptyState title="No claims" description={emptyMessage} />
        }
      />
    </Card>
  );
}

export function DisputesTable({
  disputes,
  detailPath,
}: {
  disputes: Dispute[];
  detailPath: (id: string) => string;
}) {
  const { query, setQuery, filtered } = useList(disputes, (d) =>
    [d.caseNumber, d.guaranteeReference, d.type, d.subject, d.applicant, d.beneficiary].join(" "),
  );
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <SearchAndFilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search disputes by case, guarantee, or party…"
      />
      <DataTable<Dispute>
        rows={filtered}
        columns={[
          {
            key: "case",
            header: "Case",
            render: (d) => (
              <div className="flex items-center gap-2">
                <Scale className="size-4 text-slate-400" />
                <div>
                  <p className="font-mono text-xs font-bold text-[#173b53]">{d.caseNumber}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{d.guaranteeReference}</p>
                </div>
              </div>
            ),
          },
          {
            key: "subject",
            header: "Subject",
            render: (d) => (
              <div>
                <p className="text-sm font-semibold text-slate-800">{d.type}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{d.subject}</p>
              </div>
            ),
          },
          {
            key: "applicant",
            header: "Applicant",
            render: (d) => <span className="text-sm text-slate-700">{d.applicant}</span>,
          },
          {
            key: "beneficiary",
            header: "Beneficiary",
            render: (d) => <span className="text-sm text-slate-700">{d.beneficiary}</span>,
          },
          {
            key: "opened",
            header: "Opened",
            render: (d) => <span className="text-xs text-slate-600">{d.openedDate}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (d) => <StatusBadge status={d.status} />,
          },
        ]}
        getRowKey={(d) => d.id}
        onRowClick={(d) => {
          const href = detailPath(d.id);
          if (href) router.push(href);
        }}
        empty={<EmptyState title="No disputes" description="Nothing matches in this demonstration state." />}
      />
    </Card>
  );
}