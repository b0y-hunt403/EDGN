"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/states";
import { PriorityBadge, StatusBadge } from "@/components/ui/status-badge";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Application } from "@/types";

export function WorkQueue({
  queueType,
}: {
  queueType: "maker" | "checker" | "signatory";
}) {
  const { applications, addToast } = useDemo();
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("sla");
  const router = useRouter();
  const statuses =
    queueType === "maker"
      ? ["SUBMITTED", "UNDER_REVIEW", "MORE_INFORMATION_REQUIRED"]
      : queueType === "checker"
        ? ["PENDING_CHECKER"]
        : ["APPROVED", "PENDING_SIGNATURE"];
  const rows = useMemo(() => {
    const needle = query.toLowerCase();
    const filtered = applications.filter(
      (item) =>
        statuses.includes(item.status) &&
        [item.reference, item.applicant, item.beneficiary, item.contractReference]
          .join(" ")
          .toLowerCase()
          .includes(needle) &&
        (priority === "all" || item.priority === priority),
    );
    return [...filtered].sort((a, b) =>
      sort === "amount"
        ? b.amount - a.amount
        : sort === "priority"
          ? ["Urgent", "High", "Normal"].indexOf(a.priority) -
            ["Urgent", "High", "Normal"].indexOf(b.priority)
          : a.sla.localeCompare(b.sla),
    );
  }, [applications, priority, query, sort, statuses]);

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
      key: "parties",
      header: "Applicant / beneficiary",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.applicant}</p>
          <p className="mt-0.5 max-w-64 truncate text-[11px] text-slate-400">
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
      key: "risk",
      header: "Risk",
      render: (item) => <StatusBadge status={item.riskLevel} label={item.riskLevel} />,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "assignee",
      header: "Assignment",
      render: (item) => (
        <div>
          <p className="text-xs font-medium text-slate-700">{item.assignee}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.sla}</p>
        </div>
      ),
    },
  ];

  const config = {
    maker: {
      eyebrow: "Guarantee operations",
      title: "Application work queue",
      description: "Prioritized new requests and applicant-information follow-up.",
      action: "maker",
    },
    checker: {
      eyebrow: "Credit approval",
      title: "Checker approval queue",
      description: "Maker-prepared records awaiting independent approval.",
      action: "checker",
    },
    signatory: {
      eyebrow: "Authorized issuance",
      title: "Signature queue",
      description: "Approved guarantee records ready for final document review and signature.",
      action: "sign",
    },
  }[queueType];

  return (
    <>
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              addToast(
                "Queue exported",
                "The role-scoped work queue is ready.",
                "info",
              )
            }
          >
            <Download className="size-4" />
            Export queue
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          filters={[
            {
              ariaLabel: "Priority",
              value: priority,
              onChange: setPriority,
              options: [
                { label: "All priorities", value: "all" },
                { label: "Urgent", value: "Urgent" },
                { label: "High", value: "High" },
                { label: "Normal", value: "Normal" },
              ],
            },
            {
              ariaLabel: "Sort queue",
              value: sort,
              onChange: setSort,
              options: [
                { label: "Sort by SLA", value: "sla" },
                { label: "Sort by priority", value: "priority" },
                { label: "Sort by amount", value: "amount" },
              ],
            },
          ]}
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          onRowClick={(item) =>
            router.push("/bank/applications/" + item.id + "/" + config.action)
          }
          empty={
            <EmptyState
              title="No records in this queue"
              description="Complete the previous presentation step or clear the active filters."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setPriority("all");
                  }}
                >
                  <ListChecks className="size-4" />
                  Clear filters
                </Button>
              }
            />
          }
        />
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {rows.length} applications · queue updates from the connected demo store
        </div>
      </Card>
    </>
  );
}
