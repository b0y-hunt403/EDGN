"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  Download,
  ExternalLink,
  FilePenLine,
  FilePlus2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Stamp,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button, buttonStyles } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { DetailGrid } from "@/components/shared/detail-grid";
import { Timeline } from "@/components/shared/timeline";
import { DocumentCard } from "@/components/shared/document-card";
import { EmptyState } from "@/components/shared/states";
import { QrMark } from "@/components/shared/qr-mark";
import { LifecycleDialog } from "@/features/guarantees/lifecycle-dialog";
import { useDemo } from "@/store/demo-store";
import { cn, formatMoney } from "@/lib/utils";
import type { PortalId } from "@/types";

type DetailTab = "overview" | "activity" | "documents" | "versions";
type LifecycleKind =
  | "Extension"
  | "Amendment"
  | "Additional guarantee"
  | "Release";

export function GuaranteeDetail({
  portal,
  guaranteeId,
}: {
  portal: PortalId;
  guaranteeId: string;
}) {
  const { guarantees, addToast } = useDemo();
  const [tab, setTab] = useState<DetailTab>("overview");
  const [dialog, setDialog] = useState<LifecycleKind | null>(null);
  const router = useRouter();
  const guarantee = guarantees.find(
    (item) =>
      item.id === guaranteeId ||
      item.reference === guaranteeId ||
      item.verificationReference === guaranteeId,
  );

  if (!guarantee) {
    return (
      <Card>
        <EmptyState
          title="Guarantee not found"
          description="The reference may not exist in this demonstration state."
          action={
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="size-4" />
              Go back
            </Button>
          }
        />
      </Card>
    );
  }

  const listPortal =
    portal === "developer" || portal === "court" ? "admin" : portal;
  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity & audit" },
    { id: "documents", label: "Documents" },
    { id: "versions", label: "Version history" },
  ];

  const permittedActions =
    portal === "applicant"
      ? ([
          ["Extension", CalendarPlus],
          ["Amendment", FilePenLine],
          ["Additional guarantee", FilePlus2],
          ["Release", CheckCircle2],
        ] as const)
      : portal === "beneficiary"
        ? ([
            ["Extension", CalendarPlus],
            ["Release", CheckCircle2],
          ] as const)
        : [];

  return (
    <>
      <button
        type="button"
        onClick={() => router.push("/" + listPortal + "/guarantees")}
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-3.5" />
        Back to guarantees
      </button>
      <PageHeader
        eyebrow={guarantee.type}
        title={guarantee.reference}
        description={
          guarantee.contractTitle + " · Version " + guarantee.version
        }
        actions={
          <>
            <StatusBadge status={guarantee.status} />
            <Button
              variant="outline"
              onClick={() =>
                addToast(
                  "Signed document prepared",
                  "The demonstration PDF download was recorded.",
                  "info",
                )
              }
            >
              <Download className="size-4" />
              Download signed PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <Card className="overflow-hidden">
            <div className="flex overflow-x-auto border-b border-slate-200 px-4">
              {tabs.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "relative h-12 whitespace-nowrap px-4 text-xs font-semibold transition",
                    tab === item.id
                      ? "text-[#0f6f68]"
                      : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  {item.label}
                  {tab === item.id ? (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#0f6f68]" />
                  ) : null}
                </button>
              ))}
            </div>

            {tab === "overview" ? (
              <>
                <CardContent className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#0f6f68]">
                        {guarantee.type}
                      </p>
                      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950">
                        {formatMoney(guarantee.amount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <ShieldCheck className="size-4 text-emerald-700" />
                      <p className="text-xs font-semibold text-emerald-700">
                        Integrity verified
                      </p>
                    </div>
                  </div>
                  <DetailGrid
                    columns={2}
                    items={[
                      { label: "Applicant", value: guarantee.applicant },
                      { label: "Beneficiary", value: guarantee.beneficiary },
                      { label: "Issuing bank", value: guarantee.bank },
                      { label: "Branch", value: guarantee.branch },
                      { label: "Issue date", value: guarantee.issueDate },
                      { label: "Expiry date", value: guarantee.expiryDate },
                      {
                        label: "Contract / tender reference",
                        value: guarantee.contractReference,
                      },
                      {
                        label: "Bank guarantee number",
                        value: guarantee.bankGuaranteeNumber,
                      },
                    ]}
                  />
                </CardContent>
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Contract relationship
                  </h3>
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-800">
                      {guarantee.contractTitle}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {guarantee.contractReference}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Original guarantee
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {formatMoney(guarantee.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Related guarantees
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          1 additional
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Active exposure
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {formatMoney(guarantee.amount + 2_000_000)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : null}

            {tab === "activity" ? (
              <CardContent className="p-6">
                <Timeline events={guarantee.timeline} />
              </CardContent>
            ) : null}

            {tab === "documents" ? (
              <div>
                {guarantee.documents.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onDownload={() =>
                      addToast(
                        "Document download recorded",
                        document.name + " is ready in demo mode.",
                        "info",
                      )
                    }
                  />
                ))}
              </div>
            ) : null}

            {tab === "versions" ? (
              <div className="divide-y divide-slate-100">
                {guarantee.versions.map((version) => (
                  <div key={version.version} className="flex gap-4 px-5 py-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700">
                      v{version.version}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {version.kind}
                        </p>
                        <StatusBadge
                          status={version.version === guarantee.version ? "ACTIVE" : "SUPERSEDED"}
                          label={
                            version.version === guarantee.version
                              ? "Current"
                              : "Superseded"
                          }
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{version.reason}</p>
                      <p className="mt-2 text-[11px] text-slate-400">
                        Effective {version.effectiveDate} · Signed by {version.signedBy} ·
                        Hash {version.hash}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center px-5 py-6 text-center">
              <div className="flex size-11 items-center justify-center rounded-full border border-[#0f6f68]/20 bg-[#eaf5f2] text-[#0f6f68]">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="mt-3 text-sm font-semibold text-slate-900">Digitally verified</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Signed version linked to the controlled EDGN registry.
              </p>
              <div className="mt-4">
                <QrMark size={150} />
              </div>
              <p className="mt-3 font-mono text-[11px] text-slate-500">
                {guarantee.verificationReference}
              </p>
              <Link
                href={"/verify/" + guarantee.verificationReference}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#0f6f68] hover:underline"
              >
                Open public verification
                <ExternalLink className="size-3" />
              </Link>
            </CardContent>
          </Card>

          {permittedActions.length > 0 ? (
            <Card>
              <CardHeader title="Available actions" />
              <CardContent className="space-y-2 p-3">
                {permittedActions.map(([label, Icon]) => (
                  <Button
                    key={label}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setDialog(label)}
                  >
                    <Icon className="size-4 text-slate-500" />
                    Request {label.toLowerCase()}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader title="Signature integrity" />
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Stamp className="size-4 text-[#0f6f68]" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Signature valid
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Trusted provider reference DS-8841-2026
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LockKeyhole className="size-4 text-[#0f6f68]" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Document unchanged
                  </p>
                  <p className="text-[11px] text-slate-500">
                    SHA-256 hash matches registry version
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="size-4 text-[#0f6f68]" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Verification active
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Last verified 01 Sep 2026, 09:41
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {dialog ? (
        <LifecycleDialog
          guarantee={guarantee}
          kind={dialog}
          open
          onClose={() => setDialog(null)}
        />
      ) : null}
    </>
  );
}
