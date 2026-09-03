"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/form-controls";
import { useDemo } from "@/store/demo-store";

const banks = [
  { id: "bank-cbe", name: "Commercial Bank of Ethiopia" },
  { id: "bank-awash", name: "Awash Bank" },
  { id: "bank-dashen", name: "Dashen Bank" },
  { id: "bank-abyssinia", name: "Bank of Abyssinia" },
  { id: "bank-coop", name: "Cooperative Bank of Oromia" },
];

type Step = "details" | "documents" | "review";

export default function NewGuaranteePage() {
  const router = useRouter();
  const { currentUser, banks: storeBanks, busyAction, saveDraft, submitApplication, addToast } = useDemo();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({
    type: "Performance Guarantee",
    applicant: currentUser.organization,
    beneficiary: "",
    beneficiaryTin: "",
    beneficiaryContact: "",
    contractReference: "",
    contractTitle: "",
    tenderValue: "",
    amount: "",
    currency: "ETB" as const,
    effectiveDate: "",
    expiryDate: "",
    purpose: "",
    bankId: "bank-cbe",
    branch: "Bole Branch",
    documents: ["Official company letterhead", "Signed Board authorization"],
    declaration: false,
  });

  const set = (key: keyof typeof form, value: string | boolean | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canContinue =
    form.beneficiary &&
    form.contractReference &&
    form.contractTitle &&
    form.amount &&
    form.effectiveDate &&
    form.expiryDate;

  const submit = async () => {
    if (!form.declaration) {
      addToast("Declaration required", "Please confirm the accuracy declaration to submit.", "warning");
      return;
    }
    const result = await submitApplication(form);
    if (result) {
      router.push("/applicant/guarantees");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => router.push("/applicant")}
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-3.5" />
        Back to dashboard
      </button>
      <PageHeader
        eyebrow="New guarantee request"
        title="Request a bank guarantee"
        description="Provide contract and beneficiary details. The bank reviews and the network coordinates the workflow."
      />

      <div className="mb-5 flex items-center gap-2 text-xs">
        {(["details", "documents", "review"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={
                "flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-[11px] font-bold " +
                (step === s
                  ? "border-[#0f6f68] bg-[#0f6f68] text-white"
                  : "border-slate-300 bg-white text-slate-500")
              }
            >
              {i + 1}
            </span>
            <span className={step === s ? "font-semibold text-slate-900" : "text-slate-500"}>
              {s === "details" ? "Guarantee details" : s === "documents" ? "Documents" : "Review & submit"}
            </span>
            {i < 2 && <span className="mx-1 h-px w-6 bg-slate-200" />}
          </div>
        ))}
      </div>

      <Card className="max-w-4xl">
        {step === "details" ? (
          <>
            <CardHeader
              title="Guarantee and contract details"
              description="Core fields used to prepare the guarantee request."
            />
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Field label="Guarantee type" required>
                <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
                  <option>Performance Guarantee</option>
                  <option>Bid/Tender Guarantee</option>
                  <option>Advance Payment Guarantee</option>
                  <option>Payment Guarantee</option>
                </Select>
              </Field>
              <Field label="Issuing bank" required>
                <Select value={form.bankId} onChange={(e) => set("bankId", e.target.value)}>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Proposed applicant organization">
                  <Input value={form.applicant} readOnly className="bg-slate-50" />
                </Field>
              </div>
              <Field label="Beneficiary organization" required>
                <Input
                  value={form.beneficiary}
                  onChange={(e) => set("beneficiary", e.target.value)}
                  placeholder="e.g. Addis Ababa City Roads Authority"
                />
              </Field>
              <Field label="Beneficiary TIN">
                <Input value={form.beneficiaryTin} onChange={(e) => set("beneficiaryTin", e.target.value)} placeholder="TIN" />
              </Field>
              <Field label="Contract / tender reference" required>
                <Input
                  value={form.contractReference}
                  onChange={(e) => set("contractReference", e.target.value)}
                  placeholder="e.g. AACRA/URP/W-17/2026"
                />
              </Field>
              <Field label="Contract title" required>
                <Input
                  value={form.contractTitle}
                  onChange={(e) => set("contractTitle", e.target.value)}
                  placeholder="Short works or supply description"
                />
              </Field>
              <Field label="Tender / contract value (ETB)" required>
                <Input value={form.tenderValue} onChange={(e) => set("tenderValue", e.target.value)} placeholder="8,750,000" />
              </Field>
              <Field label="Guarantee amount (ETB)" required>
                <Input value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="875,000" />
              </Field>
              <Field label="Effective date" required>
                <Input value={form.effectiveDate} onChange={(e) => set("effectiveDate", e.target.value)} placeholder="10 Sep 2026" />
              </Field>
              <Field label="Expiry date" required>
                <Input value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} placeholder="09 Sep 2027" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Purpose / remarks" hint="Optional context the issuing bank may use.">
                  <Textarea value={form.purpose} onChange={(e) => set("purpose", e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push("/applicant/applications")}>
                  Cancel
                </Button>
                <Button
                  disabled={!canContinue}
                  onClick={() => setStep("documents")}
                >
                  Continue to documents
                </Button>
              </div>
            </CardContent>
          </>
        ) : step === "documents" ? (
          <>
            <CardHeader
              title="Supporting documents"
              description="Attachments referenced by the guarantee record."
            />
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Signed Works Contract", hint: "Verified · 2.4 MB · attached" },
                { name: "Board Authorization Letter", hint: "Verified · 618 KB · attached" },
                { name: "Business License 2018 EC", hint: "KYC/KYB · 491 KB · attached" },
                { name: "Audited Financial Statement", hint: "Optional · pending upload" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <FileCheck2 className="size-5 shrink-0 text-[#0f6f68]" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{doc.name}</p>
                    <p className="text-[11px] text-slate-500">{doc.hint}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-4 sm:col-span-2">
                <Button variant="outline" onClick={() => setStep("details")}>
                  Back
                </Button>
                <Button onClick={() => setStep("review")}>Continue to review</Button>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader
              title="Review and submit"
              description="Confirm the details before the request is routed to the bank."
            />
            <CardContent>
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {[
                  ["Type", form.type],
                  ["Beneficiary", form.beneficiary],
                  ["Bank", banks.find((b) => b.id === form.bankId)?.name ?? ""],
                  ["Contract reference", form.contractReference],
                  ["Tender value", "ETB " + (form.tenderValue || "0")],
                  ["Guarantee amount", "ETB " + (form.amount || "0")],
                  ["Effective date", form.effectiveDate],
                  ["Expiry date", form.expiryDate],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{value || "—"}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <Checkbox
                  checked={form.declaration}
                  onChange={(checked) => set("declaration", checked)}
                  label="Accuracy declaration"
                  description="I confirm the information is true and that I am authorized to request this guarantee on behalf of the applicant organization."
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="size-4 text-[#0f6f68]" />
                  Submitted requests are routed to the connected bank work queue.
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("documents")}>
                    Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      void saveDraft(form);
                      addToast("Draft saved", "Your request is available from the applications dashboard.", "success");
                      router.push("/applicant/applications");
                    }}
                    disabled={busyAction !== null}
                  >
                    {busyAction !== null ? <Loader2 className="size-4 animate-spin" /> : null}
                    Save draft
                  </Button>
                  <Button onClick={submit} disabled={busyAction !== null || !form.declaration}>
                    {busyAction !== null ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                    Submit request
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </>
  );
}