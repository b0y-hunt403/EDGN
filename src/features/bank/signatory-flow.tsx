"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Circle,
  FileSignature,
  Fingerprint,
  LoaderCircle,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { DetailGrid } from "@/components/shared/detail-grid";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { Guarantee } from "@/types";

type SigningStage = "pending" | "signing" | "signed" | "issued";

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function SignatoryFlow({ applicationId }: { applicationId: string }) {
  const {
    applications,
    guarantees,
    issueApplication,
    busyAction,
    setRole,
  } = useDemo();
  const application = applications.find((item) => item.id === applicationId);
  const existingGuarantee = guarantees.find(
    (item) => item.contractReference === application?.contractReference,
  );
  const [stage, setStage] = useState<SigningStage>(
    application?.status === "ISSUED" ? "issued" : "pending",
  );
  const [issuedGuarantee, setIssuedGuarantee] = useState<Guarantee | null>(
    existingGuarantee ?? null,
  );
  const router = useRouter();

  if (!application) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <p className="text-sm font-semibold text-slate-900">Application not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            Go back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const signAndIssue = async () => {
    setStage("signing");
    await wait(900);
    setStage("signed");
    await wait(700);
    const guarantee = await issueApplication(application.id);
    if (guarantee) {
      setIssuedGuarantee(guarantee);
      setStage("issued");
    }
  };

  const stageItems: { id: SigningStage; label: string }[] = [
    { id: "pending", label: "Pending signature" },
    { id: "signing", label: "Signing" },
    { id: "signed", label: "Successfully signed" },
    { id: "issued", label: "Guarantee issued" },
  ];
  const currentIndex = stageItems.findIndex((item) => item.id === stage);

  return (
    <>
      <button
        type="button"
        onClick={() => router.push("/bank/signatures")}
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-3.5" />
        Back to signature queue
      </button>
      <PageHeader
        eyebrow="Authorized issuance"
        title={application.reference}
        description="Final guarantee document review and simulated digital signature ceremony."
        actions={<StatusBadge status={stage === "issued" ? "ISSUED" : application.status} />}
      />

      {stage === "issued" && issuedGuarantee ? (
        <Card className="mb-6 overflow-hidden border-emerald-200">
          <div className="h-1.5 bg-emerald-600" />
          <CardContent className="flex flex-col gap-5 bg-emerald-50/50 p-6 lg:flex-row lg:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                Signature verified · Registry published
              </p>
              <h2 className="mt-1 text-xl font-semibold text-emerald-950">
                {issuedGuarantee.reference} is active
              </h2>
              <p className="mt-1 text-sm text-emerald-700">
                Verification reference {issuedGuarantee.verificationReference}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  router.push("/verify/" + issuedGuarantee.verificationReference)
                }
              >
                <QrCode className="size-4" />
                Public verification
              </Button>
              <Button
                onClick={() => {
                  setRole("applicant");
                  router.push("/applicant/guarantees/" + issuedGuarantee.id);
                }}
              >
                View as Applicant
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="mb-6">
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-2 sm:grid-cols-4">
            {stageItems.map((item, index) => {
              const complete = index < currentIndex || stage === "issued";
              const active = index === currentIndex && stage !== "issued";
              return (
                <div
                  key={item.id}
                  className={
                    "flex items-center gap-3 rounded-lg border px-3 py-3 " +
                    (complete
                      ? "border-emerald-200 bg-emerald-50"
                      : active
                        ? "border-[#0f6f68] bg-[#f2f9f7]"
                        : "border-slate-200 bg-slate-50")
                  }
                >
                  <span
                    className={
                      "flex size-7 shrink-0 items-center justify-center rounded-full " +
                      (complete
                        ? "bg-emerald-600 text-white"
                        : active
                          ? "bg-[#0f6f68] text-white"
                          : "bg-slate-200 text-slate-500")
                    }
                  >
                    {complete ? (
                      <Check className="size-3.5" />
                    ) : active && stage === "signing" ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <Circle className="size-2 fill-current" />
                    )}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Generated guarantee document"
            description="Final content hash is calculated over this approved rendering."
            action={<StatusBadge status="READY" label="Ready to sign" />}
          />
          <div className="bg-slate-100 p-4 sm:p-8">
            <div className="mx-auto min-h-[720px] max-w-[720px] bg-white px-8 py-10 shadow-lg sm:px-14">
              <div className="flex items-start justify-between border-b-2 border-[#173b53] pb-5">
                <div>
                  <p className="text-lg font-bold tracking-wide text-[#173b53]">
                    COMMERCIAL BANK OF ETHIOPIA
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Bole Branch · Addis Ababa
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full border-2 border-[#173b53] text-[#173b53]">
                  <ShieldCheck className="size-6" />
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {application.type}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">
                  Guarantee in favour of {application.beneficiary}
                </h2>
              </div>
              <div className="mt-8 grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-2">
                <p className="text-xs leading-6 text-slate-600">
                  <strong className="block text-slate-900">Applicant</strong>
                  {application.applicant}
                </p>
                <p className="text-xs leading-6 text-slate-600">
                  <strong className="block text-slate-900">Amount</strong>
                  {formatMoney(application.amount)}
                </p>
                <p className="text-xs leading-6 text-slate-600">
                  <strong className="block text-slate-900">Contract reference</strong>
                  {application.contractReference}
                </p>
                <p className="text-xs leading-6 text-slate-600">
                  <strong className="block text-slate-900">Validity</strong>
                  {application.effectiveDate} to {application.expiryDate}
                </p>
              </div>
              <div className="mt-8 space-y-5 text-[13px] leading-7 text-slate-700">
                <p>
                  At the request of <strong>{application.applicant}</strong>, we hereby
                  issue this irrevocable performance guarantee in favour of{" "}
                  <strong>{application.beneficiary}</strong> for the amount stated above,
                  subject to the approved guarantee terms and conditions.
                </p>
                <p>
                  This demonstration document represents the controlled wording approved
                  through the bank maker-checker-signatory workflow. It does not constitute
                  a live banking obligation.
                </p>
              </div>
              <div className="mt-14 grid gap-8 sm:grid-cols-2">
                <div className="border-t border-slate-300 pt-3">
                  <p className="text-xs font-semibold text-slate-800">Marta Kebede</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Authorized Signatory
                  </p>
                </div>
                <div className="border-t border-slate-300 pt-3">
                  <p className="text-xs font-semibold text-slate-800">Digital seal</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Applied after signature verification
                  </p>
                </div>
              </div>
              <div className="mt-14 rounded-lg bg-slate-50 p-4 text-[10px] leading-5 text-slate-500">
                EDGN Demo Environment · Document hash preview a83f…19e2 · This
                presentation record is not a production guarantee.
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Final guarantee summary" />
            <CardContent>
              <DetailGrid
                items={[
                  { label: "Applicant", value: application.applicant },
                  { label: "Beneficiary", value: application.beneficiary },
                  { label: "Amount", value: formatMoney(application.amount) },
                  { label: "Collateral", value: application.collateralStatus },
                  { label: "Effective", value: application.effectiveDate },
                  { label: "Expiry", value: application.expiryDate },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Approval chain" />
            <CardContent className="space-y-4">
              {[
                ["Applicant submitted", "Sara Mekonnen", CheckCircle2],
                ["Maker prepared", "Tigist Alemu", CheckCircle2],
                ["Checker approved", "Henok Getachew", CheckCircle2],
                ["Collateral reserved", "CBE Core Service", CheckCircle2],
                ["Authorized signature", "Marta Kebede", Stamp],
              ].map(([label, actor, Icon], index) => {
                const IconComponent = Icon as typeof CheckCircle2;
                return (
                  <div key={String(label)} className="flex items-center gap-3">
                    <div
                      className={
                        "flex size-8 items-center justify-center rounded-full " +
                        (index < 4 || stage !== "pending"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700")
                      }
                    >
                      <IconComponent className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{String(label)}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{String(actor)}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card className="border-[#173b53]/20">
            <CardHeader title="Digital signature" />
            <CardContent>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Fingerprint className="size-5 text-[#0f6f68]" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Step-up authentication ready
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Demo certificate CBE-SIGN-2026-MK
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                  <LockKeyhole className="size-3.5" />
                  Document hash a83f…19e2
                </div>
              </div>
              {stage !== "issued" ? (
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  loading={stage === "signing" || busyAction === "transition-" + application.id}
                  disabled={stage !== "pending"}
                  onClick={() => void signAndIssue()}
                >
                  <FileSignature className="size-4" />
                  {stage === "signed" ? "Publishing to registry…" : "Sign and issue"}
                </Button>
              ) : (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-3 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="size-4" />
                  Successfully issued
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
