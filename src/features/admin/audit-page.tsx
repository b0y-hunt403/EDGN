"use client";

import { useMemo, useState } from "react";
import { Download, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/shared/states";
import { useDemo } from "@/store/demo-store";
import type { AuditEvent } from "@/types";

export function AuditPage() {
  const { auditLogs, addToast } = useDemo();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("all");
  const rows = useMemo(
    () =>
      auditLogs.filter(
        (item) =>
          [item.id, item.action, item.actor, item.target, item.correlationId]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (result === "all" || item.result === result),
      ),
    [auditLogs, query, result],
  );
  const columns: DataColumn<AuditEvent>[] = [
    {
      key: "event",
      header: "Event",
      render: (item) => (
        <div>
          <p className="font-mono text-xs font-bold text-[#173b53]">{item.id}</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-600">{item.action}</p>
        </div>
      ),
    },
    {
      key: "actor",
      header: "Actor / role",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-800">{item.actor}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.role}</p>
        </div>
      ),
    },
    { key: "target", header: "Target", render: (item) => item.target },
    { key: "result", header: "Result", render: (item) => <StatusBadge status={item.result} /> },
    {
      key: "timestamp",
      header: "Timestamp",
      render: (item) => (
        <div>
          <p className="text-xs text-slate-700">{item.timestamp}</p>
          <p className="mt-0.5 font-mono text-[10px] text-slate-400">{item.correlationId}</p>
        </div>
      ),
    },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Immutable activity record"
        title="Audit logs"
        description="Critical business, security, integration, evidence, and configuration events."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              addToast("Audit export approved", "A scoped, watermarked export was generated.", "info")
            }
          >
            <Download className="size-4" />
            Export audit
          </Button>
        }
      />
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
        <LockKeyhole className="size-4 shrink-0 text-blue-600" />
        Audit records are append-only in the production architecture. Viewing and exporting them is also audited.
      </div>
      <Card className="overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          filters={[
            {
              ariaLabel: "Audit result",
              value: result,
              onChange: setResult,
              options: [
                { label: "All results", value: "all" },
                { label: "Success", value: "Success" },
                { label: "Warning", value: "Warning" },
                { label: "Denied", value: "Denied" },
              ],
            },
          ]}
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          empty={<EmptyState />}
        />
      </Card>
    </>
  );
}
