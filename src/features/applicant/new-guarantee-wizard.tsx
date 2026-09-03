"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheckBig,
  FileText,
  Landmark,
  Save,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import {
  BankStep,
  BeneficiaryStep,
  ContractStep,
  DocumentsStep,
  RequestContextStep,
  ReviewStep,
  TermsStep,
} from "@/features/applicant/wizard-steps";
import { useDemo } from "@/store/demo-store";
import { cn } from "@/lib/utils";
import type { NewGuaranteeDraft } from "@/types";

const steps = [
  { title: "Request context", description: "Product and applicant", icon: ShieldCheck },
  { title: "Beneficiary", description: "Recipient organization", icon: Users },
  { title: "Contract / tender", description: "Underlying obligation", icon: FileText },
  { title: "Guarantee terms", description: "Amount and validity", icon: ShieldCheck },
  { title: "Bank selection", description: "Issuing institution", icon: Landmark },
  { title: "Documents", description: "Required evidence", icon: FileText },
  { title: "Review & submit", description: "Final declaration", icon: Send },
];

const initialDraft: NewGuaranteeDraft = {
  type: "Performance Guarantee",
  applicant: "Meskel Construction PLC",
  beneficiary: "Addis Ababa City Roads Authority",
  beneficiaryTin: "0000245612",
  beneficiaryContact: "contracts@aacra.demo",
  contractReference: "AACRA/URP/W-17/2026",
  contractTitle: "Akaki Kaliti Urban Road Package 17",
  tenderValue: "87,500,000.00",
  amount: "8,750,000.00",
  currency: "ETB",
  effectiveDate: "2026-09-10",
  expiryDate: "2027-09-09",
  purpose:
    "Secure the contractor's performance obligations for the Akaki Kaliti urban road works package.",
  bankId: "bank-cbe",
  branch: "Bole Branch",
  documents: [
    "Signed Works Contract.pdf",
    "Board Authorization Letter.pdf",
    "Business License 2018 EC.pdf",
  ],
  declaration: false,
};

export function NewGuaranteeWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<NewGuaranteeDraft>(initialDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const {
    banks,
    busyAction,
    saveDraft,
    submitApplication,
    setRole,
  } = useDemo();
  const router = useRouter();

  const update = <K extends keyof NewGuaranteeDraft>(
    key: K,
    value: NewGuaranteeDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (step === 0 && !draft.type) nextErrors.type = "Select a guarantee type.";
    if (step === 1) {
      if (!draft.beneficiary) nextErrors.beneficiary = "Select a beneficiary.";
      if (!draft.beneficiaryTin) nextErrors.beneficiaryTin = "TIN is required.";
      if (!draft.beneficiaryContact.includes("@")) {
        nextErrors.beneficiaryContact = "Enter a valid contact email.";
      }
    }
    if (step === 2) {
      if (!draft.contractReference) nextErrors.contractReference = "Reference is required.";
      if (!draft.contractTitle) nextErrors.contractTitle = "Title is required.";
      if (Number(draft.tenderValue.replaceAll(",", "")) <= 0) {
        nextErrors.tenderValue = "Enter a valid contract value.";
      }
    }
    if (step === 3) {
      if (Number(draft.amount.replaceAll(",", "")) <= 0) {
        nextErrors.amount = "Enter a valid guarantee amount.";
      }
      if (!draft.effectiveDate) nextErrors.effectiveDate = "Effective date is required.";
      if (!draft.expiryDate || draft.expiryDate <= draft.effectiveDate) {
        nextErrors.expiryDate = "Expiry must be after the effective date.";
      }
      if (!draft.purpose) nextErrors.purpose = "Purpose is required.";
    }
    if (step === 4 && !draft.bankId) nextErrors.bankId = "Select an issuing bank.";
    if (step === 5 && draft.documents.length < 3) {
      nextErrors.documents = "The three required document categories must be present.";
    }
    if (step === 6 && !draft.declaration) {
      nextErrors.declaration = "Confirm the declaration before submitting.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validate()) return;
    const application = await submitApplication(draft);
    if (application) setSubmittedReference(application.reference);
  };

  if (submittedReference) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-[#0f6f68]" />
          <CardContent className="px-6 py-10 text-center sm:px-12">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CircleCheckBig className="size-8" />
            </div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f6f68]">
              Request submitted
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Your application is now in the bank work queue
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Commercial Bank of Ethiopia will perform customer, document, eligibility,
              collateral, and approval review. EDGN will keep all parties informed.
            </p>
            <div className="mx-auto mt-6 max-w-sm rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Application reference
              </p>
              <p className="mt-1.5 font-mono text-base font-bold text-[#173b53]">
                {submittedReference}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Status: Submitted · Maker SLA: 8 business hours
              </p>
            </div>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => router.push("/applicant/guarantees")}
              >
                View my portfolio
              </Button>
              <Button
                onClick={() => {
                  setRole("bank-maker");
                  router.push("/bank/work-queue");
                }}
              >
                Continue demo as Bank Maker
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StepComponent =
    step === 0
      ? RequestContextStep
      : step === 1
        ? BeneficiaryStep
        : step === 2
          ? ContractStep
          : step === 3
            ? TermsStep
            : step === 5
              ? DocumentsStep
              : ReviewStep;

  return (
    <>
      <PageHeader
        eyebrow="New application"
        title="Request a bank guarantee"
        description="Complete the guided workflow. Progress can be saved at any time."
        actions={
          <Button
            variant="outline"
            loading={busyAction === "save-draft"}
            onClick={() => void saveDraft(draft)}
          >
            <Save className="size-4" />
            Save draft
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="h-fit p-3">
          <ol className="grid grid-cols-2 gap-1 sm:grid-cols-4 xl:grid-cols-1">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === step;
              const complete = index < step;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    disabled={index > step}
                    onClick={() => index < step && setStep(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition",
                      active
                        ? "bg-[#eaf5f2]"
                        : complete
                          ? "hover:bg-slate-50"
                          : "opacity-55",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
                        complete
                          ? "border-[#0f6f68] bg-[#0f6f68] text-white"
                          : active
                            ? "border-[#0f6f68] bg-white text-[#0f6f68]"
                            : "border-slate-200 bg-slate-50 text-slate-400",
                      )}
                    >
                      {complete ? <Check className="size-4" /> : <Icon className="size-4" />}
                    </span>
                    <span className="hidden min-w-0 sm:block xl:block">
                      <span className="block truncate text-xs font-semibold text-slate-800">
                        {item.title}
                      </span>
                      <span className="mt-0.5 hidden truncate text-[10px] text-slate-500 xl:block">
                        {item.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            title={steps[step].title}
            description={steps[step].description + " · Step " + (step + 1) + " of 7"}
          />
          <CardContent className="p-5 sm:p-7">
            {step === 4 ? (
              <BankStep
                draft={draft}
                update={update}
                errors={errors}
                banks={banks}
              />
            ) : (
              <StepComponent draft={draft} update={update} errors={errors} />
            )}
          </CardContent>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
            >
              <ArrowLeft className="size-4" />
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="mr-2 hidden text-xs text-slate-500 sm:block">
                Step {step + 1} of {steps.length}
              </span>
              {step === steps.length - 1 ? (
                <Button
                  loading={busyAction === "submit-application"}
                  onClick={() => void submit()}
                >
                  <Send className="size-4" />
                  Submit request
                </Button>
              ) : (
                <Button onClick={next}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
