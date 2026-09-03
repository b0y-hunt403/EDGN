"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, FilePlus2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Guarantee, PortalId } from "@/types";

export function GuaranteeList({ portal }: { portal: PortalId }) {
  const { guarantees, currentUser, addToast } = useDemo();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const router = useRouter();

  const scoped = useMemo(() => {
    if (portal === "applicant") {
      return guarantees.filter(
        (item) => item.applicant === currentUser.organization,
      );
    }
    if (portal === "beneficiary") {
      return guarantees.filter(
        (item) => item.beneficiary === currentUser.organization,
      );
    }
    return guarantees;
  }, [currentUser.organization, guarantees, portal]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return scoped.filter((item) => {
      const matchesQuery = [
        item.reference,
        item.applicant,
        item.beneficiary,
        item.contractReference,
        item.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
      const matchesStatus = status === "all" || item.status === status;
      const matchesType = type === "all" || item.type === type;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [query, scoped, status, type]);

  const columns: DataColumn<Guarantee>[] = [
    {
      key: "reference",
      header: "Reference",
      render: (item) => (
        <div>
          <p className="font-mono text-xs font-bold text-[#173b53]">
            {item.reference}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Version {item.version || "—"}
          </p>
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
      key: "type",
      header: "Guarantee type",
      render: (item) => (
        <div>
          <p>{item.type}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.bank}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span className="whitespace-nowrap font-mono text-xs font-semibold text-slate-800">
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

  const title =
    portal === "beneficiary"
      ? "Received guarantees"
      : portal === "bank"
        ? "Guarantee registry"
        : portal === "admin"
          ? "Central guarantee registry"
          : "My guarantees";
  const detailPortal =
    portal === "developer" || portal === "court" ? "admin" : portal;

  return (
    <>
      <PageHeader
        eyebrow={portal === "admin" ? "Network registry" : "Guarantee management"}
        title={title}
        description={
          portal === "beneficiary"
            ? "Verify authenticity, monitor expiry, and initiate lifecycle actions."
            : "Search issued guarantees, versions, and related contract references."
        }
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                addToast(
                  "Export prepared",
                  "A scoped demonstration CSV is ready for download.",
                  "info",
                )
              }
            >
              <Download className="size-4" />
              Export
            </Button>
            {portal === "applicant" ? (
              <Link
                href="/applicant/applications/new"
                className={buttonStyles("primary")}
              >
                <FilePlus2 className="size-4" />
                New request
              </Link>
            ) : null}
          </>
        }
      />
      <Card className="overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          filters={[
            {
              ariaLabel: "Filter by status",
              value: status,
              onChange: setStatus,
              options: [
                { label: "All statuses", value: "all" },
                { label: "Active", value: "ACTIVE" },
                { label: "Under review", value: "UNDER_REVIEW" },
                { label: "Pending approval", value: "PENDING_APPROVAL" },
                { label: "Expiring soon", value: "EXPIRING_SOON" },
                { label: "Claim pending", value: "CLAIM_PENDING" },
              ],
            },
            {
              ariaLabel: "Filter by guarantee type",
              value: type,
              onChange: setType,
              options: [
                { label: "All types", value: "all" },
                { label: "Performance", value: "Performance Guarantee" },
                { label: "Bid/Tender", value: "Bid/Tender Guarantee" },
                {
                  label: "Advance payment",
                  value: "Advance Payment Guarantee",
                },
                { label: "Payment", value: "Payment Guarantee" },
              ],
            },
          ]}
        />
        <DataTable
          rows={filtered}
          columns={columns}
          getRowKey={(item) => item.id}
          onRowClick={(item) =>
            router.push("/" + detailPortal + "/guarantees/" + item.id)
          }
          empty={
            <EmptyState
              title="No guarantees match these filters"
              description="Try a different reference, organization, status, or guarantee type."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                    setType("all");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          }
        />
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <span>{filtered.length} records</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-[#0f6f68]" />
            Scoped by role and organization
          </div>
        </div>
      </Card>
    </>
  );
}
