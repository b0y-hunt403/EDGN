"use client";

import { useState } from "react";
import { CalendarDays, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form-controls";
import { Modal } from "@/components/ui/modal";
import { guaranteeService } from "@/services/guarantee.service";
import { useDemo } from "@/store/demo-store";
import type { Guarantee } from "@/types";

export function LifecycleDialog({
  guarantee,
  kind,
  open,
  onClose,
}: {
  guarantee: Guarantee;
  kind: "Extension" | "Amendment" | "Additional guarantee" | "Release";
  open: boolean;
  onClose: () => void;
}) {
  const [reason, setReason] = useState(
    kind === "Extension"
      ? "Contract implementation schedule has been extended by the beneficiary."
      : "",
  );
  const [date, setDate] = useState("2027-12-31");
  const [loading, setLoading] = useState(false);
  const { addToast } = useDemo();

  const submit = async () => {
    setLoading(true);
    try {
      const result = await guaranteeService.saveLifecycleRequest(kind);
      addToast(
        kind + " request submitted",
        result.reference + " was added to the authorized workflow.",
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={"Request " + kind.toLowerCase()}
      description={
        guarantee.reference +
        " · Current status " +
        guarantee.status.replaceAll("_", " ").toLowerCase()
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={() => void submit()}>
            Submit request
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {kind === "Extension" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Current expiry">
              <Input value={guarantee.expiryDate} disabled />
            </Field>
            <Field label="Requested new expiry" required>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>
          </div>
        ) : null}
        <Field
          label="Reason"
          required
          hint="This statement becomes part of the auditable request record."
        >
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={"Explain the reason for this " + kind.toLowerCase()}
          />
        </Field>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-left hover:border-[#0f6f68]/50 hover:bg-[#f2f9f7]"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-white text-[#0f6f68] shadow-sm">
            <FileUp className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Add supporting document
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              PDF, DOCX, JPG or PNG · demonstration interaction
            </p>
          </div>
        </button>
      </div>
    </Modal>
  );
}
