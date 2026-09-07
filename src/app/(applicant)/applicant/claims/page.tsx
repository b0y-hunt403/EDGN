"use client";

import { useState } from "react";
import { Plus, Check, FileUp, CircleCheckBig, ArrowLeft, ArrowRight } from "lucide-react";
import { ClaimsTable, DisputesTable } from "@/features/shared/claims-disputes";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/form-controls";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";

export default function ApplicantClaimsPage() {
  const { claims, disputes, guarantees, currentUser, createClaim } = useDemo();
  const [tab, setTab] = useState<string>("claims");
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scopedClaims = claims.filter((c) => c.applicant === currentUser.organization);
  const scopedDisputes = disputes.filter(
    (d) =>
      d.applicant === currentUser.organization ||
      d.beneficiary === currentUser.organization,
  );
  const activeGuarantees = guarantees.filter(
    (g) => g.applicant === currentUser.organization,
  );

  const [selectedGuaranteeRef, setSelectedGuaranteeRef] = useState(
    activeGuarantees[0]?.reference ?? "EDGN-2026-004871",
  );
  const [amount, setAmount] = useState("1,250,000.00");
  const [reason, setReason] = useState(
    "Delay-related contractual demand under performance guarantee terms (Clause 14.2).",
  );

  const handleSubmitClaim = async () => {
    const selectedG = activeGuarantees.find(
      (g) => g.reference === selectedGuaranteeRef,
    );
    const numAmount = parseFloat(amount.replaceAll(",", "")) || 1250000;

    await createClaim({
      guaranteeReference: selectedGuaranteeRef,
      applicant: currentUser.organization,
      beneficiary: selectedG?.beneficiary || "Addis Ababa City Roads Authority",
      bank: selectedG?.bank || "Commercial Bank of Ethiopia",
      amount: numAmount,
      reason,
      documentName: "Formal Demand Notice & Contractual Default Certificate.pdf",
    });

    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Claims & disputes"
        title="Claims and disputes"
        description="Monitor beneficiary demands, decisions, and any escalated disputes handled by the EDGN desk or courts."
        actions={
          <Button
            onClick={() => {
              setModalOpen(true);
              setStep(0);
              setSubmitted(false);
              setDeclared(false);
            }}
          >
            <Plus className="size-4" />
            New claim
          </Button>
        }
      />
      <Tabs
        value={tab}
        onValueChange={setTab}
        tabs={[
          { value: "claims", label: `Claims · ${scopedClaims.length}` },
          { value: "disputes", label: `Disputes · ${scopedDisputes.length}` },
        ]}
      />
      {tab === "claims" ? (
        <ClaimsTable
          claims={scopedClaims}
          emptyMessage="There are no claims involving your organization."
          detailPath={(id) => `/applicant/claims/${id}`}
        />
      ) : (
        <DisputesTable
          disputes={scopedDisputes}
          detailPath={() => "/applicant/disputes"}
        />
      )}
      <Card className="mt-6">
        <CardContent className="p-5">
          <p className="text-xs leading-6 text-slate-500">
            Dispute and claim events also appear in your notifications and the
            guarantee timeline when they change the application state.
          </p>
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={submitted ? "Claim submitted" : "Lodge / submit guarantee claim"}
        description={
          submitted
            ? "The issuing bank and beneficiary have been formally notified."
            : `Step ${step + 1} of 3 · Digital guarantee claim entry`
        }
        size="lg"
        footer={
          submitted ? (
            <Button onClick={() => setModalOpen(false)}>Done</Button>
          ) : (
            <>
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((curr) => curr - 1)}
              >
                <ArrowLeft className="size-4" />
                Previous
              </Button>
              {step < 2 ? (
                <Button onClick={() => setStep((curr) => curr + 1)}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button disabled={!declared} onClick={handleSubmitClaim}>
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
            <h3 className="mt-4 text-lg font-semibold text-slate-950">
              Claim submitted successfully
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Assigned for bank adjudication · Review due within standard SLA.
            </p>
          </div>
        ) : step === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Associated guarantee" className="sm:col-span-2" required>
              <Select
                value={selectedGuaranteeRef}
                onChange={(e) => setSelectedGuaranteeRef(e.target.value)}
              >
                {activeGuarantees.length > 0 ? (
                  activeGuarantees.map((g) => (
                    <option key={g.id} value={g.reference}>
                      {g.reference} · {g.type} ({formatMoney(g.amount)})
                    </option>
                  ))
                ) : (
                  <option value="EDGN-2026-004871">
                    EDGN-2026-004871 · Performance Guarantee (ETB 4,250,000.00)
                  </option>
                )}
              </Select>
            </Field>
            <Field label="Claim demand amount (ETB)" required>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1,250,000.00"
              />
            </Field>
            <Field label="Currency">
              <Input value="ETB - Ethiopian Birr" disabled />
            </Field>
            <Field label="Demand legal basis & contractual ground" className="sm:col-span-2" required>
              <Textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Specify contract clauses, grounds for demand, and default notice details."
              />
            </Field>
          </div>
        ) : step === 1 ? (
          <div>
            <div className="flex w-full flex-col items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
              <FileUp className="size-6 text-[#0f6f68]" />
              <span className="mt-3 text-sm font-semibold text-slate-800">
                Claim notice & supporting evidence
              </span>
              <span className="mt-1 text-xs text-slate-500">
                Official demand letter, engineer's default notice, and contract milestone certificates.
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
              <Check className="size-4 text-emerald-700" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-emerald-900">
                  Formal Demand Notice & Contractual Default Certificate.pdf
                </p>
                <p className="text-[11px] text-emerald-700">1.4 MB · SHA-256 integrity verified</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Claim Summary</p>
              <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                <p><span className="text-slate-400">Guarantee:</span> <strong className="text-slate-800">{selectedGuaranteeRef}</strong></p>
                <p><span className="text-slate-400">Demand Amount:</span> <strong className="font-mono text-slate-800">ETB {amount}</strong></p>
                <p><span className="text-slate-400">Applicant:</span> <strong className="text-slate-800">{currentUser.organization}</strong></p>
                <p><span className="text-slate-400">Issuing Bank:</span> <strong className="text-slate-800">Commercial Bank of Ethiopia</strong></p>
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-xs leading-5 text-blue-800">
              The issuing bank will verify the claim conditions and examine the submitted documentation before deciding on settlement.
            </div>
            <Checkbox
              checked={declared}
              onChange={setDeclared}
              label="I declare that this claim demand is submitted in accordance with the terms of the guarantee"
              description="Knowingly submitting fraudulent demands will be recorded in the audit trail."
            />
          </div>
        )}
      </Modal>
    </>
  );
}