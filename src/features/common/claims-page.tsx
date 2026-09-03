"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheckBig,
  FileUp,
  Plus,
  ReceiptText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/form-controls";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";
import type { PortalId } from "@/types";

export function ClaimsPage({ portal }: { portal: PortalId }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { claims, currentUser, addToast } = useDemo();
  const scoped =
    portal === "applicant"
      ? claims.filter((item) => item.applicant === currentUser.organization)
      : portal === "beneficiary"
        ? claims.filter((item) => item.beneficiary === currentUser.organization)
        : claims;

  const submit = () => {
    setSubmitted(true);
    addToast(
      "Claim submitted",
      "CLM-2026-00185 is now in the issuing bank review queue.",
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Claim management"
        title={portal === "bank" ? "Claims decision queue" : "Claims"}
        description={
          portal === "beneficiary"
            ? "Submit and track payment demands under active guarantees."
            : "Track claims, bank decisions, and settlement state."
        }
        actions={
          portal === "beneficiary" ? (
            <Button
              onClick={() => {
                setOpen(true);
                setStep(0);
                setSubmitted(false);
              }}
            >
              <Plus className="size-4" />
              Submit claim
            </Button>
          ) : undefined
        }
      />
      <div className="grid gap-4">
        {scoped.map((claim) => (
          <Card key={claim.id}>
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#173b53]">
                <ReceiptText className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs font-bold text-[#173b53]">{claim.id}</p>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {claim.guaranteeReference} · {formatMoney(claim.amount)}
                </p>
                <p className="mt-1 text-xs text-slate-500">{claim.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs lg:text-right">
                <span className="text-slate-400">Bank</span>
                <span className="font-medium text-slate-700">{claim.bank}</span>
                <span className="text-slate-400">Due</span>
                <span className="font-medium text-slate-700">{claim.dueDate}</span>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={submitted ? "Claim submitted" : "Submit a guarantee claim"}
        description={submitted ? "The issuing bank has been notified." : "Step " + (step + 1) + " of 3"}
        size="lg"
        footer={
          submitted ? (
            <Button onClick={() => setOpen(false)}>Done</Button>
          ) : (
            <>
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((current) => current - 1)}
              >
                <ArrowLeft className="size-4" />
                Previous
              </Button>
              {step < 2 ? (
                <Button onClick={() => setStep((current) => current + 1)}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button disabled={!declared} onClick={submit}>
                  Submit claim
                </Button>
              )}
            </>
          )
        }
      >
        {submitted ? (
          <div className="py-8 text-center">
            <CircleCheckBig className="mx-auto size-12 text-emerald-700" />
            <h3 className="mt-4 text-lg font-semibold text-slate-950">CLM-2026-00185</h3>
            <p className="mt-2 text-sm text-slate-500">
              Status: Submitted · Bank review due 07 Sep 2026
            </p>
          </div>
        ) : step === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Guarantee" className="sm:col-span-2">
              <Select>
                <option>EDGN-2026-004871 · Performance Guarantee</option>
              </Select>
            </Field>
            <Field label="Claim amount">
              <Input defaultValue="1,250,000.00" />
            </Field>
            <Field label="Currency">
              <Input value="ETB" disabled />
            </Field>
            <Field label="Claim reason" className="sm:col-span-2">
              <Textarea defaultValue="Contractual demand under the performance guarantee terms." />
            </Field>
          </div>
        ) : step === 1 ? (
          <div>
            <button
              type="button"
              className="flex w-full flex-col items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-[#0f6f68]/50"
            >
              <FileUp className="size-6 text-[#0f6f68]" />
              <span className="mt-3 text-sm font-semibold text-slate-800">
                Add claim evidence
              </span>
              <span className="mt-1 text-xs text-slate-500">
                Demand letter, contract notice, and supporting certificate
              </span>
            </button>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
              <Check className="size-4 text-emerald-700" />
              <span className="text-xs font-semibold text-emerald-800">
                Formal Demand Letter.pdf · integrity checked
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-900">Claim summary</p>
              <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                <p><span className="text-slate-400">Guarantee:</span> <strong>EDGN-2026-004871</strong></p>
                <p><span className="text-slate-400">Amount:</span> <strong>ETB 1,250,000.00</strong></p>
                <p><span className="text-slate-400">Bank:</span> <strong>Commercial Bank of Ethiopia</strong></p>
                <p><span className="text-slate-400">Evidence:</span> <strong>1 document</strong></p>
              </div>
            </div>
            <Checkbox
              checked={declared}
              onChange={setDeclared}
              label="I declare that this claim is authorized and accurate"
              description="The issuing bank retains responsibility for the substantive claim decision and payment obligation."
            />
          </div>
        )}
      </Modal>
    </>
  );
}
