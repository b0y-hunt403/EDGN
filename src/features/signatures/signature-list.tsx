"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, FileSignature, Fingerprint, ShieldCheck, Stamp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Checkbox } from "@/components/ui/form-controls";
import { useDemo } from "@/store/demo-store";
import type { DigitalSignature } from "@/types";

const signedCount = (items: DigitalSignature[]) =>
  items.filter((item) => item.status === "SIGNED").length;
const pendingCount = (items: DigitalSignature[]) =>
  items.filter((item) => item.status === "PENDING" || item.status === "REQUESTED").length;

export function SignatureList() {
  const { signatures, currentUser, transitionSignature, addToast, busyAction } = useDemo();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [status, setStatus] = useState("any");
  const [selected, setSelected] = useState<DigitalSignature | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const rows = useMemo(() => {
    const needle = query.toLowerCase();
    return signatures.filter((item) => {
      const matchesQuery = [
        item.documentName,
        item.guaranteeReference ?? "",
        item.signerName,
        item.signerRole,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);

      const matchesDropdown = status === "any" || item.status === status;

      let matchesTab = true;
      if (activeTab === "pending") matchesTab = item.status === "PENDING";
      else if (activeTab === "requests") matchesTab = item.status === "REQUESTED";
      else if (activeTab === "signed") matchesTab = item.status === "SIGNED";

      return matchesQuery && matchesDropdown && matchesTab;
    });
  }, [query, status, activeTab, signatures]);

  const columns: DataColumn<DigitalSignature>[] = [
    {
      key: "document",
      header: "Document",
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800">{item.documentName}</p>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">
            {item.documentId} · {item.guaranteeReference ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => <StatusBadge status={item.documentType} />,
    },
    {
      key: "signer",
      header: "Signer / role",
      render: (item) => (
        <div>
          <p className="text-xs font-medium text-slate-700">{item.signerName}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.signerRole}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "timestamp",
      header: "Signed at",
      render: (item) => (
        <span className="text-xs text-slate-500">{item.signatureTimestamp ?? "—"}</span>
      ),
    },
  ];

  const signFlow = () => {
    if (!selected) return;
    transitionSignature(selected.id, "SIGNED");
    setConfirmed(false);
    setSelected(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Authorized issuance · Digital signatures"
        title="Digital signature manager"
        description="Signer-certified records for issued guarantees and amendments. Prototype only — no real INSA PKI integration is simulated."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              addToast(
                "Signature ledger",
                "All signed records remain immutable in the demonstration ledger.",
                "info",
              )
            }
          >
            <Stamp className="size-4" />
            Ledger
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending signatures" value={String(pendingCount(signatures))} icon={FileSignature} tone="amber" helper="Awaiting approver action" />
        <StatCard label="Signed records" value={String(signedCount(signatures))} icon={BadgeCheck} tone="teal" />
        <StatCard label="Active certificates" value="2" icon={Fingerprint} tone="navy" helper="Demo operator & approver" />
        <StatCard label="Ledger status" value="Healthy" icon={ShieldCheck} tone="slate" helper="Hash chain verified" />
      </div>

      {/* Institutional PKI Digital Signing Lifecycle Banner */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0f6f68]">
              Digital Signature & Attestation Lifecycle
            </p>
            <p className="text-xs text-slate-500">
              Dual-control digital signing ceremony with cryptographic audit hashing.
            </p>
          </div>
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">Document Created</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">Submitted</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">Approved</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-amber-50 px-2 py-1 font-semibold text-amber-800">Signature Requested</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-800">Signed</span>
            <span className="text-slate-400">→</span>
            <span className="rounded bg-[#0f6f68]/10 px-2 py-1 font-semibold text-[#0f6f68]">Guarantee Activated</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            { value: "all", label: `All Signatures (${signatures.length})` },
            {
              value: "pending",
              label: `Pending Signatures (${
                signatures.filter((s) => s.status === "PENDING").length
              })`,
            },
            {
              value: "requests",
              label: `Signature Requests (${
                signatures.filter((s) => s.status === "REQUESTED").length
              })`,
            },
            {
              value: "signed",
              label: `Signed Documents (${signedCount(signatures)})`,
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
              ariaLabel: "Signature status",
              value: status,
              onChange: setStatus,
              options: [
                { label: "Any status", value: "any" },
                { label: "Pending", value: "PENDING" },
                { label: "Signed", value: "SIGNED" },
                { label: "Rejected", value: "REJECTED" },
                { label: "Expired", value: "EXPIRED" },
              ],
            },
          ]}
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          onRowClick={(item) => setSelected(item)}
          empty={
            <EmptyState
              title="No signature records"
              description="No digital signatures match the current filter."
            />
          }
        />
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {rows.length} records · {signedCount(signatures)} signed · signature store powering bank issuance
        </div>
      </Card>

      <Modal
        open={selected !== null}
        onClose={() => {
          setSelected(null);
          setConfirmed(false);
        }}
        title={selected ? "Review and sign " + selected.documentName : ""}
        description={selected
          ? "Prototype signature ceremony for " + (selected.guaranteeReference ?? selected.documentId) + "."
          : ""}
        size="lg"
        footer={
          selected &&
          selected.status !== "SIGNED" ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  transitionSignature(selected.id, "REJECTED");
                  setSelected(null);
                  setConfirmed(false);
                }}
              >
                Reject
              </Button>
              <Button disabled={!confirmed || busyAction !== null} onClick={signFlow}>
                <FileSignature className="size-4" />
                Sign document
              </Button>
            </>
          ) : (
            <Button onClick={() => setSelected(null)}>Done</Button>
          )
        }
      >
        {selected ? (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#0f6f68]/10 text-[#0f6f68]">
                  <FileSignature className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{selected.documentName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selected.documentId} · {selected.documentType}
                  </p>
                </div>
                <StatusBadge status={selected.status} className="ml-auto" />
              </div>
              {currentUser.name === selected.signerName ? (
                <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                  You are the designated signer for this record ({selected.signerName}).
                </p>
              ) : (
                <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                  Active demo user differs from the recorded signer — proceeding as the prototype operator.
                </p>
              )}
            </div>
            <div className="grid gap-x-8 gap-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-xs sm:grid-cols-2">
              <p><span className="text-slate-400">Certificate issuer:</span> <strong className="text-slate-800">{selected.certificateIssuer}</strong></p>
              <p><span className="text-slate-400">Certificate status:</span> <StatusBadge status={selected.certificateStatus} /></p>
              <p><span className="text-slate-400">Signature hash:</span> <strong className="font-mono text-slate-800">{selected.hash}</strong></p>
              <p><span className="text-slate-400">Signer:</span> <strong className="text-slate-800">{selected.signerName} · {selected.signerRole}</strong></p>
            </div>
            {selected.status !== "SIGNED" ? (
              <Checkbox
                checked={confirmed}
                onChange={setConfirmed}
                label="I confirm this signature is authorized for the bank"
                description="The prototype does not contact INSA or any real-time-of-signing authority."
              />
            ) : (
              <p className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">
                This record was already signed at {selected.signatureTimestamp} and is immutable.
              </p>
            )}
          </div>
        ) : null}
      </Modal>
    </>
  );
}