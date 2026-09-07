"use client";

import Link from "next/link";
import { ArrowLeft, Building2, FileCheck2, ReceiptText, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button, buttonStyles } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { DetailGrid } from "@/components/shared/detail-grid";
import { DocumentCard } from "@/components/shared/document-card";
import { Timeline } from "@/components/shared/timeline";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { ClaimStatus } from "@/types";

export function ClaimDetail({ claimId }: { claimId: string }) {
  const { claims, currentUser, updateClaimStatus, busyAction, addToast } = useDemo();
  const claim = claims.find((item) => item.id === claimId);

  const backHref =
    currentUser.portal === "bank"
      ? "/bank/claims"
      : currentUser.portal === "applicant"
        ? "/applicant/claims"
        : "/beneficiary/claims";

  if (!claim) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <ReceiptText className="mx-auto size-8 text-slate-400" />
          <h1 className="mt-4 text-lg font-semibold text-slate-950">Claim not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            The claim record "{claimId}" is not part of the demonstration dataset.
          </p>
          <Link
            href={backHref}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="size-4" />
            Back to claims
          </Link>
        </CardContent>
      </Card>
    );
  }

  const canDecide = currentUser.portal === "bank";
  const nextActions: { label: string; to: ClaimStatus; tone?: string }[] = [];
  if (canDecide) {
    const actions: Record<ClaimStatus, { label: string; to: ClaimStatus }[]> = {
      SUBMITTED: [
        { label: "Start review", to: "UNDER_REVIEW" },
        { label: "Reject claim", to: "REJECTED" },
      ],
      UNDER_REVIEW: [
        { label: "Verify documents", to: "DOCUMENT_VERIFICATION" },
        { label: "Reject claim", to: "REJECTED" },
      ],
      DOCUMENT_VERIFICATION: [
        { label: "Approve claim", to: "APPROVED" },
        { label: "Reject claim", to: "REJECTED" },
      ],
      APPROVED: [{ label: "Queue payment", to: "PAYMENT_PENDING" }],
      PAYMENT_PENDING: [{ label: "Mark settled", to: "SETTLED" }],
      SETTLED: [],
      REJECTED: [],
    };
    nextActions.push(...(actions[claim.status] ?? []));
  }

  const workflowSteps = [
    { label: "Claim Submitted", activeStatuses: ["SUBMITTED", "UNDER_REVIEW", "DOCUMENT_VERIFICATION", "APPROVED", "PAYMENT_PENDING", "SETTLED"] },
    { label: "Initial Review", activeStatuses: ["UNDER_REVIEW", "DOCUMENT_VERIFICATION", "APPROVED", "PAYMENT_PENDING", "SETTLED"] },
    { label: "Document Verification", activeStatuses: ["DOCUMENT_VERIFICATION", "APPROVED", "PAYMENT_PENDING", "SETTLED"] },
    { label: "Approval / Rejection", activeStatuses: ["APPROVED", "PAYMENT_PENDING", "SETTLED", "REJECTED"] },
    { label: "Settlement", activeStatuses: ["PAYMENT_PENDING", "SETTLED"] },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Claim management"
        title={claim.reference}
        description="Beneficiary demand record linked to an active guarantee instrument."
        breadcrumbs={["Claims", claim.reference]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/${currentUser.portal === "bank" ? "bank" : currentUser.portal === "applicant" ? "applicant" : "beneficiary"}/guarantees/${claim.guaranteeReference}`}
              className={buttonStyles("outline")}
            >
              <ShieldCheck className="size-4 text-[#0f6f68]" />
              Associated guarantee
            </Link>
            <Link href={backHref} className={buttonStyles("outline")}>
              <ArrowLeft className="size-4" />
              Back to claims
            </Link>
          </div>
        }
      />

      {/* Enterprise Claim Workflow Stepper */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Claim Resolution Lifecycle
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {workflowSteps.map((step, idx) => {
            const isCompleted =
              step.activeStatuses.includes(claim.status) &&
              claim.status !== step.activeStatuses[0] &&
              claim.status !== "REJECTED";
            const isCurrent =
              claim.status === "REJECTED" && idx === 3
                ? true
                : claim.status === "SETTLED" && idx === 4
                  ? true
                  : step.activeStatuses[0] === claim.status;

            return (
              <div
                key={step.label}
                className={`relative flex flex-col justify-center rounded-lg border p-3 text-center transition ${
                  claim.status === "REJECTED" && idx === 3
                    ? "border-rose-300 bg-rose-50 text-rose-800"
                    : isCurrent
                      ? "border-[#0f6f68] bg-[#0f6f68]/5 text-[#0f6f68] font-semibold ring-1 ring-[#0f6f68]"
                      : isCompleted
                        ? "border-emerald-200 bg-emerald-50/60 text-emerald-800 font-medium"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                  Step {idx + 1}
                </span>
                <span className="mt-1 text-xs">{step.label}</span>
                {claim.status === "REJECTED" && idx === 3 ? (
                  <span className="mt-1 text-[10px] font-bold text-rose-700">Rejected</span>
                ) : isCurrent ? (
                  <span className="mt-1 text-[10px] font-bold text-[#0f6f68]">In Progress</span>
                ) : isCompleted ? (
                  <span className="mt-1 text-[10px] font-medium text-emerald-700">Completed</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Claim summary"
              description="Recorded demand state and decision obligations."
            />
            <CardContent className="p-6">
              <DetailGrid
                columns={3}
                items={[
                  { label: "Guarantee reference", value: claim.guaranteeReference },
                  { label: "Status", value: <StatusBadge status={claim.status} /> },
                  {
                    label: "Claim amount",
                    value: claim.currency + " " + formatMoney(claim.amount),
                  },
                  {
                    label: "Beneficiary",
                    value: (
                      <span className="flex items-center gap-2">
                        <Building2 className="size-4 text-slate-400" />
                        {claim.beneficiary}
                      </span>
                    ),
                  },
                  { label: "Applicant", value: claim.applicant },
                  { label: "Issuing bank", value: claim.bank },
                  { label: "Submitted", value: claim.submittedDate },
                  { label: "Decision due", value: claim.dueDate },
                  { label: "Assigned officer", value: claim.assignedOfficer },
                ]}
              />
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-slate-400">
                  Claim reason
                </p>
                <p className="mt-1.5 text-sm leading-6 text-slate-700">{claim.reason}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title="Claim documents"
              description="Beneficiary submissions and verification status."
            />
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {claim.documents.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {canDecide && nextActions.length > 0 ? (
            <Card>
              <CardHeader
                title="Decision actions"
                description="Update the demonstration claim state (bank role)."
              />
              <CardContent className="space-y-2.5 p-6">
                {nextActions.map((action) => (
                  <Button
                    key={action.to}
                    className="w-full"
                    variant={action.to === "REJECTED" ? "danger" : "primary"}
                    disabled={busyAction !== null}
                    onClick={() => {
                      updateClaimStatus(claim.id, action.to);
                      addToast(
                        "Claim updated",
                        claim.reference + " moved to " + action.to.replaceAll("_", " ") + ".",
                        action.to === "REJECTED" ? "danger" : "success",
                      );
                    }}
                  >
                    {action.to === "REJECTED" ? (
                      <>
                        <ShieldCheck className="size-4" />
                        {action.label}
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="size-4" />
                        {action.label}
                      </>
                    )}
                  </Button>
                ))}
                <p className="pt-1 text-[11px] leading-5 text-slate-400">
                  Prototype transition only — real issuance calls the bank back-office settlement API.
                </p>
              </CardContent>
            </Card>
          ) : canDecide ? (
            <Card>
              <CardContent className="p-6 text-center text-xs text-slate-500">
                This claim is final (settled or rejected) and cannot be transitioned further.
              </CardContent>
            </Card>
          ) : null}
          <Card>
            <CardHeader title="Activity timeline" description="Claim lifecycle events." />
            <CardContent className="p-6">
              <Timeline events={claim.timeline} compact />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}