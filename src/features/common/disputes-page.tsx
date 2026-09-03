"use client";

import { useState } from "react";
import {
  FileKey2,
  Gavel,
  MessageSquareWarning,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { useDemo } from "@/store/demo-store";
import type { PortalId } from "@/types";

export function DisputesPage({ portal }: { portal: PortalId }) {
  const [open, setOpen] = useState(false);
  const { disputes, currentUser, addToast } = useDemo();
  const scoped =
    portal === "applicant"
      ? disputes.filter((item) => item.applicant === currentUser.organization)
      : portal === "beneficiary"
        ? disputes.filter((item) => item.beneficiary === currentUser.organization)
        : disputes;
  return (
    <>
      <PageHeader
        eyebrow="Case management"
        title="Disputes"
        description="Case records, party responses, evidence, and escalation workflows."
        actions={
          portal === "applicant" || portal === "beneficiary" ? (
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              Open dispute
            </Button>
          ) : undefined
        }
      />
      <div className="grid gap-4">
        {scoped.map((dispute) => (
          <Card key={dispute.id}>
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                {dispute.status === "COURT_REFERRED" ? (
                  <Gavel className="size-5" />
                ) : (
                  <MessageSquareWarning className="size-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs font-bold text-[#173b53]">
                    {dispute.caseNumber}
                  </p>
                  <StatusBadge status={dispute.status} />
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {dispute.subject}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {dispute.guaranteeReference} · {dispute.type}
                </p>
              </div>
              <div className="flex items-center gap-5 text-xs">
                <div>
                  <p className="text-slate-400">Evidence</p>
                  <p className="mt-1 flex items-center gap-1 font-semibold text-slate-700">
                    <FileKey2 className="size-3.5" />
                    {dispute.evidenceCount} items
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Next action</p>
                  <p className="mt-1 max-w-48 font-semibold text-slate-700">
                    {dispute.nextAction}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Open case room
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Open a dispute"
        description="Create a controlled case and preserve the related evidence."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                addToast(
                  "Dispute created",
                  "DSP-2026-00218 was opened and relevant parties were notified.",
                );
              }}
            >
              <ShieldAlert className="size-4" />
              Create dispute
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Related guarantee">
            <Select>
              <option>EDGN-2026-004871 · Performance Guarantee</option>
            </Select>
          </Field>
          <Field label="Dispute type">
            <Select>
              <option>Claim dispute</option>
              <option>Authenticity dispute</option>
              <option>Amount dispute</option>
              <option>Expiry dispute</option>
              <option>Technical / integration dispute</option>
            </Select>
          </Field>
          <Field label="Subject">
            <Input defaultValue="Disputed contractual demand" />
          </Field>
          <Field label="Description">
            <Textarea defaultValue="Provide the facts, requested outcome, and related communication references." />
          </Field>
        </div>
      </Modal>
    </>
  );
}
