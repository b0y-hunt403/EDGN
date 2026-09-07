"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, FilePlus2, FileSignature, ShieldCheck, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Checkbox } from "@/components/ui/form-controls";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Guarantee, PortalId } from "@/types";

export function GuaranteeList({ portal }: { portal: PortalId }) {
  const { guarantees, currentUser, addToast, signGuaranteeAsApplicant } = useDemo();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [signTarget, setSignTarget] = useState<Guarantee | null>(null);
  const [signConfirmed, setSignConfirmed] = useState(false);
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

      let matchesTab = true;
      if (activeTab === "active") matchesTab = item.status === "ACTIVE";
      else if (activeTab === "pending")
        matchesTab =
          item.status === "PENDING_APPROVAL" || item.status === "UNDER_REVIEW";
      else if (activeTab === "drafts") matchesTab = item.status === "DRAFT";
      else if (activeTab === "expired") matchesTab = item.status === "EXPIRED";

      return matchesQuery && matchesStatus && matchesType && matchesTab;
    });
  }, [query, scoped, status, type, activeTab]);

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
    ...(portal === "applicant"
      ? [
          {
            key: "applicantSignature",
            header: "Applicant PKI",
            render: (item: Guarantee) => (
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {item.signatureStatus === "SIGNED" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="size-3.5" />
                    PKI Attested
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-[#0f6f68] text-xs font-medium text-[#0f6f68] hover:bg-[#0f6f68] hover:text-white"
                    onClick={() => {
                      setSignTarget(item);
                      setSignConfirmed(false);
                    }}
                  >
                    <FileSignature className="mr-1 size-3.5" />
                    Sign (PKI)
                  </Button>
                )}
              </div>
            ),
          } satisfies DataColumn<Guarantee>,
        ]
      : []),
  ];

  const title =
    portal === "beneficiary"
      ? "Received guarantees"
      : portal === "bank"
        ? "Guarantee registry"
        : portal === "admin"
          ? "Central guarantee registry"
          : "My guarantees";
  const detailPortal = portal === "admin" ? "admin" : portal;

  const unsignedCount =
    portal === "applicant"
      ? scoped.filter((g) => g.signatureStatus !== "SIGNED").length
      : 0;

  const handleConfirmPkiSign = async () => {
    if (!signTarget) return;
    await signGuaranteeAsApplicant(signTarget.id);
    setSignTarget(null);
    setSignConfirmed(false);
  };

  return (
    <>
      <PageHeader
        eyebrow={portal === "admin" ? "Network registry" : "Guarantee management"}
        title={title}
        description={
          portal === "beneficiary"
            ? "Monitor coverage, authenticity, and initiate lifecycle actions."
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

      {portal === "applicant" && unsignedCount > 0 ? (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <KeyRound className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-900">
                Institutional PKI attestation requested
              </p>
              <p className="text-[11px] text-amber-700">
                {unsignedCount} guarantee instrument requires your authorized digital counter-signature.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 bg-white text-xs font-medium text-amber-900 hover:bg-amber-100"
            onClick={() => {
              const pending = scoped.find((g) => g.signatureStatus !== "SIGNED");
              if (pending) {
                setSignTarget(pending);
                setSignConfirmed(false);
              }
            }}
          >
            Review and sign
          </Button>
        </div>
      ) : null}

      <div className="mb-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            { value: "all", label: `All Guarantees (${scoped.length})` },
            {
              value: "active",
              label: `Active (${scoped.filter((g) => g.status === "ACTIVE").length})`,
            },
            {
              value: "pending",
              label: `Pending Approval (${
                scoped.filter(
                  (g) =>
                    g.status === "PENDING_APPROVAL" ||
                    g.status === "UNDER_REVIEW",
                ).length
              })`,
            },
            {
              value: "drafts",
              label: `Drafts (${scoped.filter((g) => g.status === "DRAFT").length})`,
            },
            {
              value: "expired",
              label: `Expired (${scoped.filter((g) => g.status === "EXPIRED").length})`,
            },
          ]}
        />
      </div>

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
                { label: "Retention", value: "Retention Guarantee" },
                { label: "Custom", value: "Custom Guarantee" },
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
                    setActiveTab("all");
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

      {/* PKI Attestation Modal for Applicant */}
      <Modal
        open={signTarget !== null}
        onClose={() => {
          setSignTarget(null);
          setSignConfirmed(false);
        }}
        title="Confirm applicant PKI digital signature"
        description={
          signTarget
            ? `Apply institutional cryptographic signature to ${signTarget.reference} (${signTarget.type})`
            : ""
        }
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setSignTarget(null);
                setSignConfirmed(false);
              }}
            >
              Cancel
            </Button>
            <Button disabled={!signConfirmed} onClick={handleConfirmPkiSign}>
              <FileSignature className="mr-1 size-4" />
              Confirm PKI signature
            </Button>
          </>
        }
      >
        {signTarget ? (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#0f6f68]/10 text-[#0f6f68]">
                  <FileSignature className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {signTarget.reference}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {signTarget.applicant} · {signTarget.type}
                  </p>
                </div>
                <StatusBadge status={signTarget.status} className="ml-auto" />
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-xs sm:grid-cols-2">
              <p>
                <span className="text-slate-400">Beneficiary:</span>{" "}
                <strong className="text-slate-800">{signTarget.beneficiary}</strong>
              </p>
              <p>
                <span className="text-slate-400">Guarantee Amount:</span>{" "}
                <strong className="font-mono text-slate-800">
                  {formatMoney(signTarget.amount)}
                </strong>
              </p>
              <p>
                <span className="text-slate-400">Issuing Bank:</span>{" "}
                <strong className="text-slate-800">{signTarget.bank}</strong>
              </p>
              <p>
                <span className="text-slate-400">Expiry Date:</span>{" "}
                <strong className="text-slate-800">{signTarget.expiryDate}</strong>
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                PKI Certificate & Cryptographic Profile
              </p>
              <div className="mt-2.5 grid gap-2.5 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-slate-400">Signer Identity:</span>
                  <p className="font-semibold text-slate-800">{currentUser.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Signer Role:</span>
                  <p className="font-semibold text-slate-800">{currentUser.title}</p>
                </div>
                <div>
                  <span className="text-slate-400">Certificate Authority:</span>
                  <p className="font-semibold text-slate-800">Institutional PKI Service (Demo)</p>
                </div>
                <div>
                  <span className="text-slate-400">Algorithm & Hash:</span>
                  <p className="font-mono text-slate-800">RSA-4096 / SHA-256 Digest</p>
                </div>
              </div>
            </div>

            <Checkbox
              checked={signConfirmed}
              onChange={setSignConfirmed}
              label="I certify and confirm this applicant digital signature for the guarantee instrument"
              description="Applies cryptographic attestation to counterparty records. This demonstration simulates an enterprise PKI token signing event."
            />
          </div>
        ) : null}
      </Modal>
    </>
  );
}
