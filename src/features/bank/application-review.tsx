"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  MessageSquarePlus,
  RotateCcw,
  Send,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Field, Textarea } from "@/components/ui/form-controls";
import { PageHeader } from "@/components/shared/page-header";
import { DetailGrid } from "@/components/shared/detail-grid";
import { DocumentCard } from "@/components/shared/document-card";
import { Timeline } from "@/components/shared/timeline";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { ApplicationStatus, DemoRoleId } from "@/types";

type ReviewAction =
  | "start"
  | "information"
  | "return"
  | "reject"
  | "checker"
  | "approve";

const actionConfig: Record<
  ReviewAction,
  {
    title: string;
    description: string;
    status: ApplicationStatus;
    assignee: string;
    event: string;
  }
> = {
  start: {
    title: "Start maker review",
    description: "Assign this application and mark it under active review.",
    status: "UNDER_REVIEW",
    assignee: "Tigist Alemu",
    event: "Maker review started",
  },
  information: {
    title: "Request additional information",
    description: "Pause the SLA and notify the applicant with your request.",
    status: "MORE_INFORMATION_REQUIRED",
    assignee: "Applicant response",
    event: "Additional information requested",
  },
  return: {
    title: "Return for correction",
    description: "Send the prepared record back to the maker queue.",
    status: "UNDER_REVIEW",
    assignee: "Tigist Alemu",
    event: "Returned to maker for correction",
  },
  reject: {
    title: "Reject application",
    description: "Record the reason and close this approval path.",
    status: "REJECTED",
    assignee: "Closed",
    event: "Application rejected by bank",
  },
  checker: {
    title: "Submit to checker",
    description: "Confirm the maker review and route it for independent approval.",
    status: "PENDING_CHECKER",
    assignee: "Henok Getachew",
    event: "Maker review completed and submitted to checker",
  },
  approve: {
    title: "Approve guarantee application",
    description: "Confirm the terms, reserve, and approval conditions.",
    status: "APPROVED",
    assignee: "Marta Kebede",
    event: "Checker approval completed",
  },
};

export function ApplicationReview({
  applicationId,
  mode,
}: {
  applicationId: string;
  mode: "maker" | "checker";
}) {
  const {
    applications,
    busyAction,
    transitionApplication,
    setRole,
    addToast,
  } = useDemo();
  const [activeAction, setActiveAction] = useState<ReviewAction | null>(null);
  const [reason, setReason] = useState("");
  const [completed, setCompleted] = useState(false);
  const router = useRouter();
  const application = applications.find((item) => item.id === applicationId);

  const checklist = useMemo(
    () =>
      application
        ? [
            {
              label: "Applicant KYC/KYB",
              value: application.kycStatus,
              icon: UserCheck,
            },
            {
              label: "Required documents",
              value:
                application.documents.length >= 3
                  ? "Complete"
                  : "Review required",
              icon: FileCheck2,
            },
            {
              label: "Collateral / reserve",
              value: application.collateralStatus,
              icon: CircleDollarSign,
            },
            {
              label: "Approval matrix",
              value: "CBE High Value · Level 2",
              icon: ClipboardCheck,
            },
          ]
        : [],
    [application],
  );

  if (!application) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <AlertTriangle className="mx-auto size-8 text-amber-600" />
          <h2 className="mt-3 text-lg font-semibold">Application not found</h2>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            Go back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const execute = async () => {
    if (!activeAction) return;
    const config = actionConfig[activeAction];
    const result = await transitionApplication(
      application.id,
      config.status,
      config.assignee,
      config.event,
    );
    setActiveAction(null);
    setReason("");
    if (result && (activeAction === "checker" || activeAction === "approve")) {
      setCompleted(true);
    }
  };

  const switchRoleAndContinue = (role: DemoRoleId, href: string) => {
    setRole(role);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() =>
          router.push(mode === "maker" ? "/bank/work-queue" : "/bank/approvals")
        }
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-3.5" />
        Back to {mode === "maker" ? "work queue" : "approval queue"}
      </button>
      <PageHeader
        eyebrow={mode === "maker" ? "Maker review" : "Independent checker approval"}
        title={application.reference}
        description={application.type + " · " + application.contractTitle}
        actions={
          <>
            <PriorityBadge priority={application.priority} />
            <StatusBadge status={application.status} />
          </>
        }
      />

      {completed ? (
        <Card className="mb-6 border-emerald-200 bg-emerald-50/60">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-950">
                {mode === "maker"
                  ? "Maker review submitted to checker"
                  : "Application approved for authorized signature"}
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                The connected workflow state is ready for the next presentation role.
              </p>
            </div>
            <Button
              onClick={() =>
                mode === "maker"
                  ? switchRoleAndContinue("bank-checker", "/bank/approvals")
                  : switchRoleAndContinue("bank-signatory", "/bank/signatures")
              }
            >
              Continue as {mode === "maker" ? "Bank Checker" : "Bank Signatory"}
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Applicant & request summary"
              description="Data supplied by the applicant and verified through the demo directory."
            />
            <CardContent>
              <DetailGrid
                columns={3}
                items={[
                  { label: "Applicant", value: application.applicant },
                  { label: "Beneficiary", value: application.beneficiary },
                  { label: "Guarantee type", value: application.type },
                  { label: "Requested amount", value: formatMoney(application.amount) },
                  { label: "Effective date", value: application.effectiveDate },
                  { label: "Expiry date", value: application.expiryDate },
                  { label: "Contract reference", value: application.contractReference },
                  { label: "Contract value", value: formatMoney(application.tenderValue) },
                  { label: "Submitted", value: application.submittedAt },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Control checklist" />
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#eaf5f2] text-[#0f6f68]">
                    <item.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-500">{item.label}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-800">{item.value}</p>
                  </div>
                  <Check className="size-4 text-emerald-600" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Supporting documents" />
            {application.documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDownload={() =>
                  addToast(
                    "Document opened",
                    document.name + " is verified in demo mode.",
                    "info",
                  )
                }
              />
            ))}
          </Card>

          <Card>
            <CardHeader title="Workflow timeline" />
            <CardContent>
              <Timeline events={application.timeline} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Exposure & risk" />
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Existing + requested exposure
                </p>
                <p className="mt-1.5 text-xl font-semibold text-slate-950">
                  {formatMoney(application.exposure)}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[58%] rounded-full bg-[#0f6f68]" />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  58% of the demonstration customer threshold
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-800">Risk assessment</p>
                  <StatusBadge status={application.riskLevel} label={application.riskLevel} />
                </div>
                <ul className="mt-3 space-y-2">
                  {application.riskObservations.map((observation) => (
                    <li key={observation} className="flex gap-2 text-xs leading-5 text-slate-600">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[#0f6f68]" />
                      {observation}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#173b53]/20">
            <CardHeader
              title={mode === "maker" ? "Maker actions" : "Checker decision"}
              description={
                mode === "maker"
                  ? "Prepare and route without giving final bank approval."
                  : "Independent review under the configured approval matrix."
              }
            />
            <CardContent className="space-y-2 p-4">
              {mode === "maker" ? (
                <>
                  {application.status === "SUBMITTED" ? (
                    <Button className="w-full" onClick={() => setActiveAction("start")}>
                      <Building2 className="size-4" />
                      Start review
                    </Button>
                  ) : null}
                  <Button className="w-full" onClick={() => setActiveAction("checker")}>
                    <Send className="size-4" />
                    Submit to checker
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveAction("information")}
                  >
                    <MessageSquarePlus className="size-4" />
                    Request information
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                    onClick={() => setActiveAction("reject")}
                  >
                    <X className="size-4" />
                    Reject application
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" onClick={() => setActiveAction("approve")}>
                    <ShieldCheck className="size-4" />
                    Approve for signature
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveAction("return")}
                  >
                    <RotateCcw className="size-4" />
                    Return for correction
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                    onClick={() => setActiveAction("reject")}
                  >
                    <X className="size-4" />
                    Reject
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {activeAction ? (
        <Modal
          open
          onClose={() => setActiveAction(null)}
          title={actionConfig[activeAction].title}
          description={actionConfig[activeAction].description}
          footer={
            <>
              <Button variant="outline" onClick={() => setActiveAction(null)}>
                Cancel
              </Button>
              <Button
                variant={activeAction === "reject" ? "danger" : "primary"}
                loading={busyAction === "transition-" + application.id}
                onClick={() => void execute()}
              >
                Confirm action
              </Button>
            </>
          }
        >
          <Field
            label={
              ["information", "return", "reject"].includes(activeAction)
                ? "Reason / instruction"
                : "Review note"
            }
            required={["information", "return", "reject"].includes(activeAction)}
            hint="This note becomes part of the application audit record."
          >
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Record the decision rationale or next instruction"
            />
          </Field>
        </Modal>
      ) : null}
    </>
  );
}
