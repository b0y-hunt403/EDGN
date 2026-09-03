"use client";

import { useState } from "react";
import {
  CalendarPlus,
  CheckCircle2,
  FilePenLine,
  FilePlus2,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Field, Select, Textarea } from "@/components/ui/form-controls";
import { useDemo } from "@/store/demo-store";

const requestRecords = [
  {
    reference: "EXT-2026-00127",
    guarantee: "EDGN-2026-004871",
    type: "Extension",
    requested: "31 Dec 2027",
    status: "UNDER_REVIEW",
    updated: "31 Aug 2026",
  },
  {
    reference: "AMD-2026-00084",
    guarantee: "EDGN-2026-004864",
    type: "Amendment",
    requested: "Contract reference correction",
    status: "PENDING_APPROVAL",
    updated: "29 Aug 2026",
  },
  {
    reference: "ADD-2026-00042",
    guarantee: "EDGN-2026-004871",
    type: "Additional guarantee",
    requested: "ETB 2,000,000.00",
    status: "ACTIVE",
    updated: "18 Aug 2026",
  },
  {
    reference: "REL-2026-00061",
    guarantee: "EDGN-2026-004801",
    type: "Release",
    requested: "Final completion",
    status: "PENDING_APPROVAL",
    updated: "27 Aug 2026",
  },
];

const icons = {
  Extension: CalendarPlus,
  Amendment: FilePenLine,
  "Additional guarantee": FilePlus2,
  Release: CheckCircle2,
};

export function LifecycleRequests({
  mode = "all",
}: {
  mode?: "all" | "extensions" | "releases";
}) {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState(
    mode === "extensions" ? "Extension" : mode === "releases" ? "Release" : "Extension",
  );
  const { addToast } = useDemo();
  const records = requestRecords.filter(
    (item) =>
      mode === "all" ||
      (mode === "extensions" && item.type === "Extension") ||
      (mode === "releases" && item.type === "Release"),
  );
  return (
    <>
      <PageHeader
        eyebrow="Guarantee lifecycle"
        title={
          mode === "extensions"
            ? "Extension requests"
            : mode === "releases"
              ? "Release requests"
              : "Lifecycle requests"
        }
        description="Track extensions, amendments, additional guarantees, and release workflows."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            New request
          </Button>
        }
      />
      <div className="grid gap-4">
        {records.map((item) => {
          const Icon = icons[item.type as keyof typeof icons];
          return (
            <Card key={item.reference}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#0f6f68]">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs font-bold text-[#173b53]">
                      {item.reference}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {item.type} · {item.guarantee}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Requested: {item.requested} · Updated {item.updated}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create lifecycle request"
        description="The selected request follows its own approval and audit workflow."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                addToast(
                  requestType + " request created",
                  "A new auditable draft was added.",
                );
              }}
            >
              Create request
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Request type">
            <Select
              value={requestType}
              onChange={(event) => setRequestType(event.target.value)}
            >
              <option>Extension</option>
              <option>Amendment</option>
              <option>Additional guarantee</option>
              <option>Release</option>
            </Select>
          </Field>
          <Field label="Guarantee">
            <Select>
              <option>EDGN-2026-004871 · Performance Guarantee</option>
              <option>EDGN-2026-004864 · Performance Guarantee</option>
            </Select>
          </Field>
          <Field label="Reason">
            <Textarea defaultValue="Contract schedule or authorized lifecycle requirement." />
          </Field>
        </div>
      </Modal>
    </>
  );
}
