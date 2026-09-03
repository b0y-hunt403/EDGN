"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  Banknote,
  CalendarClock,
  CheckCircle2,
  Download,
  Eye,
  FileKey2,
  FileQuestion,
  Gavel,
  GitBranch,
  PackageCheck,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { useDemo } from "@/store/demo-store";
import {
  closedCourtCases,
  courtAppeals,
  courtBankInstructions,
  courtExecutionRecords,
  courtHearings,
  courtInformationRequests,
} from "@/mocks/court-workspace";

export type CourtRecordsView = "evidence" | "information-requests" | "hearings" | "decisions" | "appeals" | "instructions" | "execution" | "closed";

const viewMeta: Record<CourtRecordsView, { eyebrow: string; title: string; description: string }> = {
  evidence: { eyebrow: "Evidence integrity", title: "Evidence review", description: "Case-scoped evidence manifests, access policy, provenance, and cryptographic integrity." },
  "information-requests": { eyebrow: "Procedural communication", title: "Information requests", description: "Authorized requests, party responses, deadlines, and verification status." },
  hearings: { eyebrow: "Judicial calendar", title: "Hearing management", description: "Formal schedules, party notification state, courtroom allocation, and attendance records." },
  decisions: { eyebrow: "Authorized judicial records", title: "Orders & decisions", description: "Draft, authenticated, and issued judicial records. EDGN does not independently make decisions." },
  appeals: { eyebrow: "Appellate workflow", title: "Appeals", description: "Appeal periods, authenticated filings, record bundles, and authorized transfers." },
  instructions: { eyebrow: "Institutional communication", title: "Bank instructions", description: "Authenticated judicial instructions, bank acknowledgements, and transmission evidence." },
  execution: { eyebrow: "Post-decision oversight", title: "Execution tracking", description: "Operational acknowledgements and evidence recorded against authorized judicial actions." },
  closed: { eyebrow: "Judicial archive", title: "Closed cases", description: "Finalized cases retained according to judicial access and retention controls." },
};

export function CourtRecordsPage({ view }: { view: CourtRecordsView }) {
  const { courtCases, addToast } = useDemo();
  const [query, setQuery] = useState("");
  const meta = viewMeta[view];
  const evidence = useMemo(
    () => courtCases.flatMap((item) => item.evidence.map((record) => ({ ...record, caseNumber: item.courtCaseNumber }))),
    [courtCases],
  );

  const shell = (items: Array<{ key: string; search: string; content: React.ReactNode }>) => {
    const visible = items.filter((item) => item.search.toLowerCase().includes(query.toLowerCase()));
    return (
      <>
        <SearchAndFilterBar query={query} onQueryChange={setQuery} placeholder={"Search " + meta.title.toLowerCase()} />
        <div className="divide-y divide-slate-100">{visible.map((item) => <div key={item.key}>{item.content}</div>)}</div>
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">{visible.length} authorized records · Demo Environment</div>
      </>
    );
  };

  let content: React.ReactNode;
  if (view === "evidence") {
    content = shell(evidence.map((item) => ({
      key: item.id,
      search: [item.id, item.title, item.submittedBy, item.caseNumber].join(" "),
      content: <RecordRow icon={FileKey2} tone="violet" title={item.title} reference={item.id + " · " + item.caseNumber} detail={"Submitted by " + item.submittedBy + " · " + item.hash} status={item.integrity} action="Open viewer" onAction={() => addToast("Evidence viewer opened", item.id + " · judicial access recorded", "info")} />,
    })));
  } else if (view === "information-requests") {
    content = shell(courtInformationRequests.map((item) => ({
      key: item.id, search: Object.values(item).join(" "),
      content: <RecordRow icon={FileQuestion} tone="amber" title={item.subject} reference={item.id + " · " + item.caseNumber} detail={item.recipient + " · due " + item.due} status={item.status} action="Review response" onAction={() => addToast("Request opened", item.id + " · party correspondence visible", "info")} />,
    })));
  } else if (view === "hearings") {
    content = shell(courtHearings.map((item) => ({
      key: item.id, search: Object.values(item).join(" "),
      content: <RecordRow icon={CalendarClock} tone="blue" title={item.type} reference={item.id + " · " + item.caseNumber} detail={item.date + " · " + item.time + " · " + item.room} status={item.status} action="Open hearing" onAction={() => addToast("Hearing workspace opened", item.parties, "info")} />,
    })));
  } else if (view === "decisions") {
    const cases = courtCases.filter((item) => item.status.includes("DECISION"));
    content = shell(cases.map((item) => ({
      key: item.id, search: [item.courtCaseNumber, item.applicant, item.beneficiary, item.decisionStatus].join(" "),
      content: <RecordRow icon={Gavel} tone="violet" title={item.decisionStatus} reference={item.courtCaseNumber + " · " + item.guaranteeReference} detail={item.applicant + " v. " + item.beneficiary} status={item.status} action="Open record" onAction={() => { window.location.href = "/court/cases/" + item.id; }} />,
    })));
  } else if (view === "appeals") {
    content = shell(courtAppeals.map((item) => ({
      key: item.id, search: Object.values(item).join(" "),
      content: <RecordRow icon={GitBranch} tone="violet" title={item.appellant} reference={item.id + " · " + item.caseNumber} detail={item.destination + " · " + item.recordStatus} status={item.status} action="View bundle" onAction={() => addToast("Appeal bundle opened", item.id + " · integrity verified", "info")} />,
    })));
  } else if (view === "instructions") {
    content = shell(courtBankInstructions.map((item) => ({
      key: item.id, search: Object.values(item).join(" "),
      content: <RecordRow icon={Banknote} tone="blue" title={item.instruction} reference={item.id + " · " + item.caseNumber} detail={item.bank + " · acknowledged " + item.acknowledgement} status={item.status} action="View receipt" onAction={() => addToast("Transmission receipt opened", item.id + " · mTLS delivery verified", "info")} />,
    })));
  } else if (view === "execution") {
    content = shell(courtExecutionRecords.map((item) => ({
      key: item.id, search: Object.values(item).join(" "),
      content: <RecordRow icon={PackageCheck} tone="green" title={item.requiredAction} reference={item.id + " · " + item.caseNumber} detail={item.responsibleParty + " · " + item.evidence} status={item.status} action="Update record" onAction={() => addToast("Execution record refreshed", item.id + " · no external state changed", "info")} />,
    })));
  } else {
    content = shell(closedCourtCases.map((item) => ({
      key: item.id, search: Object.values(item).join(" "),
      content: <RecordRow icon={Archive} tone="slate" title={item.parties} reference={item.caseNumber + " · " + item.guaranteeReference} detail={item.outcome + " · " + item.retention} status={item.status} action="Open archive" onAction={() => addToast("Archived case opened", item.caseNumber + " · read-only access", "info")} />,
    })));
  }

  return (
    <>
      <div className="mb-5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Gavel className="size-4 shrink-0 text-violet-600" />
          <p className="text-xs text-violet-700">Judicial authority remains with the competent court. This view records authorized workflow and evidence only.</p>
        </div>
      </div>
      <PageHeader
        eyebrow={meta.eyebrow}
        title={meta.title}
        description={meta.description}
        actions={
          <Button variant="outline" onClick={() => addToast(view === "execution" ? "Execution status refreshed" : "Register exported", "The case-scoped access policy was applied.", "info")}>
            {view === "execution" ? <RotateCw className="size-4" /> : <Download className="size-4" />}
            {view === "execution" ? "Refresh status" : "Export register"}
          </Button>
        }
      />
      <Card className="overflow-hidden">{content}</Card>
    </>
  );
}

function RecordRow({ icon: Icon, tone, title, reference, detail, status, action, onAction }: {
  icon: typeof Gavel;
  tone: "violet" | "amber" | "blue" | "green" | "slate";
  title: string;
  reference: string;
  detail: string;
  status: string;
  action: string;
  onAction: () => void;
}) {
  const tones = {
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
      <div className={"flex size-11 shrink-0 items-center justify-center rounded-lg " + tones[tone]}><Icon className="size-5" /></div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 font-mono text-[11px] font-semibold text-[#3d345b]">{reference}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
      </div>
      <StatusBadge status={status} />
      <Button variant="outline" size="sm" onClick={onAction}><Eye className="size-4" />{action}</Button>
    </CardContent>
  );
}
