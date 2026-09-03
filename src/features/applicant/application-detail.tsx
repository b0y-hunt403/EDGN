"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { DetailGrid } from "@/components/shared/detail-grid";
import { Timeline } from "@/components/shared/timeline";
import { DocumentCard } from "@/components/shared/document-card";
import { EmptyState } from "@/components/shared/states";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";

export function ApplicantApplicationDetail({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const { applications, addToast } = useDemo();
  const application = applications.find((a) => a.id === applicationId);

  if (!application) {
    return (
      <Card>
        <EmptyState
          title="Application not found"
          description="The reference may not exist in this demonstration state."
          action={
            <Button variant="outline" onClick={() => router.push("/applicant/applications")}>
              <ArrowLeft className="size-4" />
              Back to applications
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <Link
        href="/applicant/applications"
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-3.5" />
        Back to applications
      </Link>
      <PageHeader
        eyebrow={application.type}
        title={application.reference}
        description={application.contractTitle}
        actions={
          <>
            <StatusBadge status={application.status} />
            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              <Clock3 className="size-3" />
              {application.sla}
            </span>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader title="Details" />
            <CardContent>
              <DetailGrid
                columns={2}
                items={[
                  { label: "Applicant", value: application.applicant },
                  { label: "Beneficiary", value: application.beneficiary },
                  { label: "Bank", value: application.bank },
                  { label: "Guarantee type", value: application.type },
                  { label: "Guarantee amount", value: formatMoney(application.amount) },
                  { label: "Tender value", value: formatMoney(application.tenderValue) },
                  { label: "Contract reference", value: application.contractReference },
                  { label: "Submitted", value: application.submittedAt },
                  { label: "Assignee", value: application.assignee },
                  {
                    label: "KYC / KYB",
                    value: application.kycStatus ?? "—",
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Key documents" />
            <CardContent className="space-y-3">
              {application.documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDownload={() =>
                    addToast(
                      "Document download recorded",
                      doc.name + " is ready in demo mode.",
                      "info",
                    )
                  }
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Workflow activity" />
            <CardContent>
              <Timeline events={application.timeline} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-[#173b53] bg-[#173b53] text-white">
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold">
                <ShieldCheck className="size-4 text-[#62d2bd]" />
                SLA {application.priority}
              </div>
              <p className="text-xs leading-5 text-slate-300">
                This application is routed through the four-eyes maker / checker
                control before authorized signature and issuance.
              </p>
              <div className="rounded-lg bg-white/8 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Active exposure
                </p>
                <p className="mt-1 font-mono text-sm font-bold text-white">
                  {formatMoney(application.exposure)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Risk observations" />
            <CardContent>
              <p className="text-xs font-semibold text-slate-800">
                Overall risk · {application.riskLevel ?? "Moderate"}
              </p>
              <ul className="mt-3 space-y-2">
                {application.riskObservations.map((observation) => (
                  <li
                    key={observation}
                    className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600"
                  >
                    <FileCheck2 className="mt-0.5 size-3.5 shrink-0 text-[#0f6f68]" />
                    {observation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}