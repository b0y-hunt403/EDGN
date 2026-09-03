"use client";

import { CalendarClock, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDemo } from "@/store/demo-store";
import { formatMoney } from "@/lib/utils";

export function ExpiringGuarantees() {
  const { guarantees, addToast } = useDemo();
  const records = guarantees.filter((item) => item.status === "EXPIRING_SOON");
  return (
    <>
      <PageHeader
        eyebrow="Expiry monitoring"
        title="Guarantees approaching expiry"
        description="Review coverage continuity and initiate an extension request where required."
      />
      <div className="grid gap-4">
        {records.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
              <div className="flex size-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <CalendarClock className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs font-bold text-[#173b53]">{item.reference}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {item.applicant} · {formatMoney(item.amount)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Expires {item.expiryDate} · {item.contractTitle}
                </p>
              </div>
              <Button
                onClick={() =>
                  addToast(
                    "Extension request started",
                    item.reference + " was added to your request workspace.",
                  )
                }
              >
                <Send className="size-4" />
                Request extension
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
