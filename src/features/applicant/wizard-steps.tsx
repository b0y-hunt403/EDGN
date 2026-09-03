"use client";

import {
  Building2,
  Check,
  FileCheck2,
  FileText,
  Landmark,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/utils";
import type { Bank, NewGuaranteeDraft } from "@/types";

interface StepProps {
  draft: NewGuaranteeDraft;
  update: <K extends keyof NewGuaranteeDraft>(
    key: K,
    value: NewGuaranteeDraft[K],
  ) => void;
  errors: Record<string, string>;
}

export function RequestContextStep({ draft, update, errors }: StepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Guarantee type" required error={errors.type} className="sm:col-span-2">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Performance Guarantee",
            "Bid/Tender Guarantee",
            "Advance Payment Guarantee",
            "Retention Guarantee",
          ].map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => update("type", type)}
              className={
                "flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left transition " +
                (draft.type === type
                  ? "border-[#0f6f68] bg-[#f2f9f7] ring-1 ring-[#0f6f68]/20"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50")
              }
            >
              <ShieldCheck
                className={
                  "size-4 " +
                  (draft.type === type ? "text-[#0f6f68]" : "text-slate-400")
                }
              />
              <span className="mt-3 text-xs font-semibold text-slate-800">
                {type}
              </span>
            </button>
          ))}
        </div>
      </Field>
      <Field label="Applicant organization" required>
        <Input value={draft.applicant} disabled />
      </Field>
      <Field
        label="Authorized representative"
        hint="Submitting as Finance & Contracts Manager"
      >
        <Input value="Sara Mekonnen" disabled />
      </Field>
      <div className="sm:col-span-2 rounded-lg border border-blue-200 bg-blue-50/60 p-4">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 size-4 shrink-0 text-blue-700" />
          <div>
            <p className="text-xs font-semibold text-blue-900">
              Organization verification complete
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-700">
              TIN 0012847395 · Business license current · Authorized representative verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BeneficiaryStep({ draft, update, errors }: StepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        label="Beneficiary organization"
        required
        error={errors.beneficiary}
        className="sm:col-span-2"
      >
        <Select
          value={draft.beneficiary}
          onChange={(event) => update("beneficiary", event.target.value)}
        >
          <option>Addis Ababa City Roads Authority</option>
          <option>Ethiopian Electric Power</option>
          <option>Ministry of Trade and Regional Integration</option>
          <option>Ethiopian Shipping and Logistics</option>
          <option>Oromia Roads Authority</option>
        </Select>
      </Field>
      <Field label="Beneficiary TIN" required error={errors.beneficiaryTin}>
        <Input
          value={draft.beneficiaryTin}
          onChange={(event) => update("beneficiaryTin", event.target.value)}
        />
      </Field>
      <Field label="Authorized contact email" required error={errors.beneficiaryContact}>
        <Input
          type="email"
          value={draft.beneficiaryContact}
          onChange={(event) => update("beneficiaryContact", event.target.value)}
        />
      </Field>
      <div className="sm:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
            <Check className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-900">
              Beneficiary found in the EDGN directory
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              Verified government organization · 12 authorized representatives
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContractStep({ draft, update, errors }: StepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Contract / tender reference" required error={errors.contractReference}>
        <Input
          value={draft.contractReference}
          onChange={(event) => update("contractReference", event.target.value)}
        />
      </Field>
      <Field label="Contract value" required error={errors.tenderValue}>
        <div className="flex">
          <span className="flex h-10 items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-500">
            ETB
          </span>
          <Input
            inputMode="decimal"
            value={draft.tenderValue}
            onChange={(event) => update("tenderValue", event.target.value)}
            className="rounded-l-none"
          />
        </div>
      </Field>
      <Field label="Contract / tender title" required error={errors.contractTitle} className="sm:col-span-2">
        <Input
          value={draft.contractTitle}
          onChange={(event) => update("contractTitle", event.target.value)}
        />
      </Field>
      <Field label="Procurement organization reference" className="sm:col-span-2">
        <Input value="AACRA-eGP-2026-W017" onChange={() => undefined} />
      </Field>
      <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <FileText className="size-5 shrink-0 text-[#0f6f68]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-800">
            Akaki Kaliti Urban Road Package 17 — Contract.pdf
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            2.4 MB · uploaded 31 Aug 2026 · integrity checked
          </p>
        </div>
        <StatusBadge status="VERIFIED" />
      </div>
    </div>
  );
}

export function TermsStep({ draft, update, errors }: StepProps) {
  const tenderValue = Number(draft.tenderValue.replaceAll(",", "")) || 0;
  const calculated = tenderValue * 0.1;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Guarantee amount" required error={errors.amount}>
        <div className="flex">
          <span className="flex h-10 items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-500">
            ETB
          </span>
          <Input
            inputMode="decimal"
            value={draft.amount}
            onChange={(event) => update("amount", event.target.value)}
            className="rounded-l-none"
          />
        </div>
      </Field>
      <Field label="Currency">
        <Select value={draft.currency} disabled>
          <option>ETB</option>
        </Select>
      </Field>
      <Field label="Requested effective date" required error={errors.effectiveDate}>
        <Input
          type="date"
          value={draft.effectiveDate}
          onChange={(event) => update("effectiveDate", event.target.value)}
        />
      </Field>
      <Field label="Requested expiry date" required error={errors.expiryDate}>
        <Input
          type="date"
          value={draft.expiryDate}
          onChange={(event) => update("expiryDate", event.target.value)}
        />
      </Field>
      <Field label="Guarantee purpose" required error={errors.purpose} className="sm:col-span-2">
        <Textarea
          value={draft.purpose}
          onChange={(event) => update("purpose", event.target.value)}
        />
      </Field>
      <div className="sm:col-span-2 rounded-lg border border-[#0f6f68]/20 bg-[#f2f9f7] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-900">
              Configured rule · Performance 10% Standard
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Required amount is 10% of the contract value. Your request matches the rule.
            </p>
          </div>
          <span className="whitespace-nowrap font-mono text-xs font-bold text-[#0f6f68]">
            {formatMoney(calculated)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BankStep({
  draft,
  update,
  errors,
  banks,
}: StepProps & { banks: Bank[] }) {
  return (
    <div>
      <Field label="Select issuing bank" required error={errors.bankId}>
        <div className="grid gap-3 sm:grid-cols-2">
          {banks.slice(0, 4).map((bank) => (
            <button
              type="button"
              key={bank.id}
              onClick={() => update("bankId", bank.id)}
              className={
                "flex items-center gap-3 rounded-lg border p-4 text-left transition " +
                (draft.bankId === bank.id
                  ? "border-[#0f6f68] bg-[#f2f9f7] ring-1 ring-[#0f6f68]/20"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50")
              }
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: bank.logoTone }}
              >
                {bank.shortName.slice(0, 3).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {bank.name}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {bank.integrationStatus} · {bank.responseTime}
                </p>
              </div>
              {draft.bankId === bank.id ? (
                <Check className="size-4 text-[#0f6f68]" />
              ) : null}
            </button>
          ))}
        </div>
      </Field>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Preferred branch" required>
          <Select
            value={draft.branch}
            onChange={(event) => update("branch", event.target.value)}
          >
            <option>Bole Branch</option>
            <option>Head Office Corporate Branch</option>
            <option>Mexico Branch</option>
            <option>Sar Bet Branch</option>
          </Select>
        </Field>
        <Field label="Customer relationship reference">
          <Input value="CBE-CUST-1182047" onChange={() => undefined} />
        </Field>
      </div>
      <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50/60 p-4">
        <div className="flex gap-3">
          <Landmark className="mt-0.5 size-4 shrink-0 text-blue-700" />
          <div>
            <p className="text-xs font-semibold text-blue-900">
              Bank retains decision authority
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-700">
              EDGN routes this request. The selected bank performs credit, collateral, approval, and issuance decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocumentsStep({ draft, update, errors }: StepProps) {
  const remove = (name: string) =>
    update(
      "documents",
      draft.documents.filter((item) => item !== name),
    );
  return (
    <div>
      <Field label="Required documents" required error={errors.documents}>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
          {draft.documents.map((document) => (
            <div key={document} className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <FileCheck2 className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {document}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  PDF · integrity checked · ready
                </p>
              </div>
              <StatusBadge status="VERIFIED" />
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                onClick={() => remove(document)}
                aria-label={"Remove " + document}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </Field>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() =>
          update("documents", [
            ...draft.documents,
            "Additional Supporting Schedule.pdf",
          ])
        }
      >
        <Plus className="size-4" />
        Add document
      </Button>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {["Contract", "Authority letter", "Business license"].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3"
          >
            <Check className="size-4 text-emerald-700" />
            <span className="text-xs font-semibold text-emerald-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewStep({ draft, update, errors }: StepProps) {
  const sections = [
    {
      title: "Request",
      items: [
        ["Type", draft.type],
        ["Applicant", draft.applicant],
      ],
    },
    {
      title: "Beneficiary",
      items: [
        ["Organization", draft.beneficiary],
        ["TIN", draft.beneficiaryTin],
      ],
    },
    {
      title: "Contract",
      items: [
        ["Reference", draft.contractReference],
        ["Title", draft.contractTitle],
        ["Value", "ETB " + draft.tenderValue],
      ],
    },
    {
      title: "Guarantee terms",
      items: [
        ["Amount", "ETB " + draft.amount],
        ["Effective date", draft.effectiveDate],
        ["Expiry date", draft.expiryDate],
      ],
    },
  ];
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-900">{section.title}</p>
            <dl className="mt-3 space-y-2.5">
              {section.items.map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="max-w-[65%] text-right text-xs font-semibold text-slate-800">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <Checkbox
          checked={draft.declaration}
          onChange={(value) => update("declaration", value)}
          label="I confirm this request is complete and accurate"
          description="I am authorized to submit on behalf of Meskel Construction PLC. The bank retains all approval and issuance authority."
        />
        {errors.declaration ? (
          <p className="mt-2 text-xs text-rose-600">{errors.declaration}</p>
        ) : null}
      </div>
    </div>
  );
}
