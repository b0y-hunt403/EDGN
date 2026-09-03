"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  Download,
  Eye,
  FileKey2,
  FileQuestion,
  Gavel,
  LockKeyhole,
  Scale,
  Send,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { DetailGrid } from "@/components/shared/detail-grid";
import { EmptyState } from "@/components/shared/states";
import { PageHeader } from "@/components/shared/page-header";
import { Timeline } from "@/components/shared/timeline";
import { courtService } from "@/services/court.service";
import { useDemo } from "@/store/demo-store";
import type { CourtEvidence, TimelineEvent } from "@/types";

type CaseTab = "summary" | "evidence" | "timeline" | "hearings" | "decision" | "execution";
type CaseDialog = "information" | "hearing" | "decision" | null;

export function CourtCaseDetail({ caseId }: { caseId: string }) {
  const router = useRouter();
  const { courtCases, addToast } = useDemo();
  const courtCase = courtCases.find((item) => item.id === caseId);
  const [tab, setTab] = useState<CaseTab>("summary");
  const [dialog, setDialog] = useState<CaseDialog>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<CourtEvidence | null>(null);
  const [busy, setBusy] = useState(false);
  const [requestCreated, setRequestCreated] = useState(false);
  const [hearingScheduled, setHearingScheduled] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [localEvents, setLocalEvents] = useState<TimelineEvent[]>([]);

  if (!courtCase) {
    return (
      <Card>
        <EmptyState
          title="Judicial case not found"
          description="The case is outside this authorized demonstration scope."
          action={
            <Button variant="outline" onClick={() => router.push("/court/cases")}>
              <ArrowLeft className="size-4" />
              Back to case queue
            </Button>
          }
        />
      </Card>
    );
  }

  const performAction = async () => {
    if (!dialog) return;
    setBusy(true);
    try {
      if (dialog === "information") {
        const result = await courtService.createInformationRequest();
        setRequestCreated(true);
        setLocalEvents((items) => [
          {
            id: result.id,
            title: "Information request issued",
            description: "The authorized party was notified and a response deadline was recorded.",
            date: "01 Sep 2026, just now",
            actor: "Meron Bekele · Authorized Judicial Officer",
            tone: "warning",
          },
          ...items,
        ]);
        addToast("Information request issued", result.id + " · response due " + result.dueDate);
      }
      if (dialog === "hearing") {
        const result = await courtService.scheduleHearing();
        setHearingScheduled(true);
        setLocalEvents((items) => [
          {
            id: result.id,
            title: "Hearing scheduled",
            description: "Authorized parties received the formal hearing notice.",
            date: "01 Sep 2026, just now",
            actor: "Federal First Instance Court Registry",
            tone: "success",
          },
          ...items,
        ]);
        addToast("Hearing scheduled", result.id + " · " + result.date);
      }
      if (dialog === "decision") {
        const result = await courtService.saveDecisionDraft();
        setDraftSaved(true);
        setLocalEvents((items) => [
          {
            id: result.id,
            title: "Decision draft saved",
            description: "Draft retained within the judicial workspace; no decision was issued.",
            date: "01 Sep 2026, just now",
            actor: "Meron Bekele · Authorized Judicial Officer",
            tone: "neutral",
          },
          ...items,
        ]);
        addToast("Decision draft saved", "No order has been issued or transmitted.", "info");
      }
      setDialog(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => router.push("/court/cases")}
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-3.5" />
        Back to case queue
      </button>

      <div className="mb-5 rounded-xl border border-violet-200 bg-violet-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <Scale className="size-5 shrink-0 text-violet-600" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-violet-800">Case-scoped access</p>
            <p className="mt-0.5 text-xs text-violet-700">EDGN records and transmits authorized instructions. It does not determine facts or judicial outcomes.</p>
          </div>
        </div>
      </div>

      <PageHeader
        eyebrow={courtCase.division}
        title={courtCase.courtCaseNumber}
        description={courtCase.applicant + " v. " + courtCase.beneficiary}
        breadcrumbs={["Judicial workspace", "Case queue", courtCase.courtCaseNumber]}
        actions={
          <>
            <StatusBadge status={courtCase.status} />
            <Button variant="outline" onClick={() => addToast("Case bundle prepared", "The authorized evidence manifest is ready.", "info")}>
              <Download className="size-4" />
              Export case bundle
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="min-w-0 overflow-hidden">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as CaseTab)}
            tabs={[
              { value: "summary", label: "Case summary" },
              { value: "evidence", label: "Evidence (" + courtCase.evidence.length + ")" },
              { value: "timeline", label: "Timeline" },
              { value: "hearings", label: "Hearings" },
              { value: "decision", label: "Orders & decision" },
              { value: "execution", label: "Execution" },
            ]}
            className="px-4 pt-2"
          />

          {tab === "summary" ? (
            <>
              <CardContent className="border-b border-slate-100 p-6">
                <DetailGrid
                  columns={2}
                  items={[
                    { label: "Applicant", value: courtCase.applicant },
                    { label: "Beneficiary", value: courtCase.beneficiary },
                    { label: "Issuing bank", value: courtCase.bank },
                    { label: "Jurisdiction", value: courtCase.jurisdiction },
                    { label: "Related guarantee", value: courtCase.guaranteeReference },
                    { label: "Related claim", value: courtCase.claimReference },
                    { label: "EDGN dispute", value: courtCase.edgnDisputeId },
                    { label: "Referral registered", value: courtCase.referralDate },
                  ]}
                />
              </CardContent>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-900">Procedural position</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    ["Next hearing", hearingScheduled ? "08 Sep 2026 · 09:30" : courtCase.nextHearing, CalendarPlus],
                    ["Decision", draftSaved ? "Draft saved · not issued" : courtCase.decisionStatus, Gavel],
                    ["Execution", courtCase.executionStatus, Stamp],
                  ].map(([label, value, Icon]) => {
                    const IconComponent = Icon as typeof Gavel;
                    return (
                      <div key={String(label)} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <IconComponent className="size-4 text-[#3d345b]" />
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{String(label)}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-800">{String(value)}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </>
          ) : null}

          {tab === "evidence" ? (
            <div className="divide-y divide-slate-100">
              {courtCase.evidence.length ? courtCase.evidence.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedEvidence(item)}
                  className="flex w-full flex-col gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <FileKey2 className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.id} · {item.category} · submitted by {item.submittedBy}</p>
                  </div>
                  <div className="text-xs sm:text-right">
                    <p className="font-mono text-[11px] text-slate-500">{item.hash}</p>
                    <p className="mt-1 inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <ShieldCheck className="size-3" /> {item.integrity}
                    </p>
                  </div>
                  <Eye className="size-4 text-slate-400" />
                </button>
              )) : <EmptyState title="No evidence admitted" description="Evidence will appear after authorized submission and integrity validation." />}
            </div>
          ) : null}

          {tab === "timeline" ? (
            <CardContent className="p-6">
              <Timeline events={[...localEvents, ...courtCase.timeline]} />
            </CardContent>
          ) : null}

          {tab === "hearings" ? (
            <CardContent className="space-y-4 p-6">
              <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-violet-950">{hearingScheduled ? "Case management conference" : "Next scheduled event"}</p>
                    <p className="mt-1 text-xs text-violet-700">{hearingScheduled ? "08 Sep 2026 · 09:30 · Courtroom 4" : courtCase.nextHearing}</p>
                  </div>
                  <StatusBadge status="SCHEDULED" />
                </div>
              </div>
              <p className="text-xs leading-5 text-slate-500">Formal notices are delivered only to authorized case parties and recorded in the case timeline.</p>
            </CardContent>
          ) : null}

          {tab === "decision" ? (
            <CardContent className="space-y-4 p-6">
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-amber-900"><LockKeyhole className="size-4" /> Judicial authority boundary</p>
                <p className="mt-1.5 text-xs leading-5 text-amber-800">Only a duly authorized judicial officer may approve or issue an order. Saving a draft creates no instruction or legal effect.</p>
              </div>
              <DetailGrid items={[
                { label: "Decision state", value: draftSaved ? "Draft saved · not issued" : courtCase.decisionStatus },
                { label: "Appeal state", value: courtCase.appealStatus },
                { label: "Authentication", value: "Required before issuance" },
                { label: "Transmission", value: "No instruction transmitted" },
              ]} />
            </CardContent>
          ) : null}

          {tab === "execution" ? (
            <CardContent className="p-6">
              <div className="flex gap-4 rounded-lg border border-slate-200 p-5">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-700" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{courtCase.executionStatus}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">EDGN records acknowledgements and supporting execution evidence; the responsible institution remains accountable for operational execution.</p>
                </div>
              </div>
            </CardContent>
          ) : null}
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Authorized actions" />
            <CardContent className="space-y-2 p-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => setDialog("information")}>
                <FileQuestion className="size-4 text-violet-700" />
                Request information
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setDialog("hearing")}>
                <CalendarPlus className="size-4 text-violet-700" />
                Schedule hearing
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setDialog("decision")}>
                <Gavel className="size-4 text-violet-700" />
                Prepare decision draft
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Case controls" />
            <CardContent className="space-y-4">
              {[
                ["Assigned officer", courtCase.assignedOfficer],
                ["Access policy", "Assigned judicial case team"],
                ["Legal hold", "Active across related records"],
                ["Evidence integrity", courtCase.evidence.length + " visible items verified"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-800">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {requestCreated ? (
            <Card className="border-emerald-200 bg-emerald-50/60">
              <CardContent className="flex gap-3 p-4">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-700" />
                <div><p className="text-xs font-semibold text-emerald-900">Information request active</p><p className="mt-1 text-xs text-emerald-700">CIR-2026-00419 · due 04 Sep 2026</p></div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      <Modal
        open={dialog !== null}
        onClose={() => setDialog(null)}
        title={dialog === "information" ? "Issue information request" : dialog === "hearing" ? "Schedule judicial hearing" : "Prepare decision draft"}
        description={dialog === "decision" ? "Draft only · no legal effect until authorized issuance" : "This action is recorded in the judicial audit trail."}
        footer={
          <>
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button loading={busy} onClick={() => void performAction()}>
              <Send className="size-4" />
              {dialog === "information" ? "Issue request" : dialog === "hearing" ? "Schedule hearing" : "Save draft"}
            </Button>
          </>
        }
      >
        {dialog === "information" ? (
          <div className="space-y-5">
            <Field label="Recipient"><Select><option>{courtCase.applicant}</option><option>{courtCase.beneficiary}</option><option>{courtCase.bank}</option></Select></Field>
            <Field label="Information requested"><Textarea defaultValue="Provide the updated construction progress certificate and authenticated engineer approval relevant to the disputed demand." /></Field>
            <Field label="Response due"><Input type="date" defaultValue="2026-09-04" /></Field>
          </div>
        ) : dialog === "hearing" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Hearing type" className="sm:col-span-2"><Select><option>Case management conference</option><option>Evidence admissibility hearing</option><option>Final submissions</option></Select></Field>
            <Field label="Date"><Input type="date" defaultValue="2026-09-08" /></Field>
            <Field label="Time"><Input type="time" defaultValue="09:30" /></Field>
            <Field label="Courtroom" className="sm:col-span-2"><Select><option>Commercial Bench · Courtroom 4</option><option>Commercial Bench · Courtroom 2</option></Select></Field>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">EDGN provides the controlled drafting and transmission workspace only. The competent court independently determines and authorizes the decision.</div>
            <Field label="Document type"><Select><option>Interim procedural order</option><option>Final judicial decision</option><option>Execution direction</option></Select></Field>
            <Field label="Draft text"><Textarea className="min-h-40" defaultValue="Draft judicial text for authorized review. This content is not issued and creates no instruction." /></Field>
          </div>
        )}
      </Modal>

      <Modal
        open={selectedEvidence !== null}
        onClose={() => setSelectedEvidence(null)}
        title={selectedEvidence?.title ?? "Evidence viewer"}
        description={selectedEvidence?.id + " · controlled judicial access"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => addToast("Evidence manifest exported", "The download is watermarked for the assigned case.", "info")}><Download className="size-4" />Download</Button>
            <Button onClick={() => setSelectedEvidence(null)}>Close viewer</Button>
          </>
        }
      >
        {selectedEvidence ? (
          <div className="space-y-5">
            <div className="flex min-h-64 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
              <div className="text-center"><FileKey2 className="mx-auto size-10 text-violet-700" /><p className="mt-3 text-sm font-semibold text-slate-800">Protected evidence preview</p><p className="mt-1 text-xs text-slate-500">Presentation representation · page 1 of 4</p></div>
            </div>
            <DetailGrid items={[
              { label: "Submitted by", value: selectedEvidence.submittedBy },
              { label: "Submitted", value: selectedEvidence.date },
              { label: "Integrity", value: selectedEvidence.integrity },
              { label: "Content hash", value: selectedEvidence.hash },
              { label: "Access", value: selectedEvidence.access },
              { label: "Watermark", value: courtCase.courtCaseNumber },
            ]} />
          </div>
        ) : null}
      </Modal>
    </>
  );
}
