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
  FileSignature,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Stamp,
  View,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button, buttonStyles } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Checkbox } from "@/components/ui/form-controls";
import { PageHeader } from "@/components/shared/page-header";
import { DetailGrid } from "@/components/shared/detail-grid";
import { Timeline } from "@/components/shared/timeline";
import { DocumentCard } from "@/components/shared/document-card";
import { EmptyState } from "@/components/shared/states";
import { QrMark } from "@/components/shared/qr-mark";
import { LifecycleDialog } from "@/features/guarantees/lifecycle-dialog";
import { GuaranteeCertificate } from "@/components/guarantee/certificate";
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
  const { guarantees, addToast, signGuaranteeAsApplicant } = useDemo();
  const [tab, setTab] = useState<DetailTab>("overview");
  const [dialog, setDialog] = useState<LifecycleKind | null>(null);
  const [signing, setSigning] = useState(false);
  const [signConfirmed, setSignConfirmed] = useState(false);
  const [showingCertificate, setShowingCertificate] = useState(false);
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

  const listPortal = portal === "admin" ? "admin" : portal;
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
              onClick={() => setShowingCertificate(true)}
            >
              <View className="size-4" />
              View certificate
            </Button>
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
                <CardContent className="border-t border-slate-100 p-5 sm:p-6">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Approval & Governance History
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          1. Maker Action
                        </span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Prepared
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-800">
                        Yonas Bekele
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Guarantee Officer · Maker
                      </p>
                      <p className="mt-2 text-[10px] text-slate-400">
                        {guarantee.issueDate}, 09:30 EAT
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          2. Checker Review
                        </span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Validated
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-800">
                        Rahel Desta
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Credit Reviewer · Checker
                      </p>
                      <p className="mt-2 text-[10px] text-slate-400">
                        {guarantee.issueDate}, 11:15 EAT
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          3. Approver Authorization
                        </span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Approved
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-800">
                        Dawit Haile
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Branch Manager · Approver
                      </p>
                      <p className="mt-2 text-[10px] text-slate-400">
                        {guarantee.issueDate}, 14:40 EAT
                      </p>
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

          {portal === "applicant" ? (
            <Card>
              <CardHeader title="Applicant authorization" />
              <CardContent className="space-y-2 p-3">
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  onClick={() => {
                    setSigning(true);
                    setSignConfirmed(false);
                  }}
                >
                  <FileSignature className="size-4" />
                  Sign as applicant
                </Button>
                <p className="px-1 text-[11px] leading-4 text-slate-500">
                  Review and attest this guarantee with a PKI-style confirm signature.
                </p>
              </CardContent>
            </Card>
          ) : null}

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

      <Modal
        open={signing}
        onClose={() => {
          setSigning(false);
          setSignConfirmed(false);
        }}
        title="Confirm and sign as applicant"
        description={
          "PKI-style attestation for " +
          guarantee.reference +
          " · " +
          guarantee.type +
          "."
        }
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setSigning(false);
                setSignConfirmed(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!signConfirmed}
              onClick={async () => {
                await signGuaranteeAsApplicant(guarantee.id);
                setSigning(false);
                setSignConfirmed(false);
              }}
            >
              <FileSignature className="size-4" />
              Confirm signature
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#0f6f68]/10 text-[#0f6f68]">
                <FileSignature className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {guarantee.reference}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {guarantee.applicant} · {guarantee.type}
                </p>
              </div>
              <StatusBadge status={guarantee.status} className="ml-auto" />
            </div>
          </div>
          <div className="grid gap-x-8 gap-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-xs sm:grid-cols-2">
            <p><span className="text-slate-400">Beneficiary:</span> <strong className="text-slate-800">{guarantee.beneficiary}</strong></p>
            <p><span className="text-slate-400">Amount:</span> <strong className="font-mono text-slate-800">{formatMoney(guarantee.amount)}</strong></p>
            <p><span className="text-slate-400">Issuing bank:</span> <strong className="text-slate-800">{guarantee.bank}</strong></p>
            <p><span className="text-slate-400">Expiry:</span> <strong className="text-slate-800">{guarantee.expiryDate}</strong></p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 text-xs leading-5 text-emerald-800">
            <ShieldCheck className="mr-1 inline size-4 align-text-bottom" />
            The prototype demonstrates a PKI-style confirm signature. No real
            certificate authority, INSA, or trust provider is contacted.
          </div>
          <Checkbox
            checked={signConfirmed}
            onChange={setSignConfirmed}
            label="I confirm this applicant signature is authorized for this guarantee"
            description="Reviewing and attesting does not alter the bank's issued guarantee record."
          />
        </div>
      </Modal>
      <Modal
        open={showingCertificate}
        onClose={() => setShowingCertificate(false)}
        title="Digital guarantee certificate"
        description={
          "Registry certificate for " +
          guarantee.reference +
          " · " +
          guarantee.type +
          "."
        }
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowingCertificate(false)}>
              Close
            </Button>
            <Button
              onClick={() =>
                addToast(
                  "Certificate exported",
                  "The demonstration certificate PDF was prepared.",
                  "info",
                )
              }
            >
              <Download className="size-4" />
              Export certificate
            </Button>
          </>
        }
      >
        <GuaranteeCertificate guarantee={guarantee} />
      </Modal>
    </>
  );
}
