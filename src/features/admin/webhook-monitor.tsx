"use client";

import { RotateCw, Webhook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { webhookDeliveries } from "@/mocks/developer";
import { useDemo } from "@/store/demo-store";

export function WebhookMonitor() {
  const { addToast } = useDemo();
  return (
    <>
      <PageHeader
        eyebrow="Event delivery"
        title="Webhook deliveries"
        description="Event delivery status, response codes, retries, and replay controls."
      />
      <div className="grid gap-4">
        {webhookDeliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Webhook className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs font-bold text-[#173b53]">{delivery.id}</p>
                  <StatusBadge status={delivery.status} />
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">{delivery.event}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{delivery.endpoint}</p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-xs">
                <div><p className="text-slate-400">Response</p><p className="mt-1 font-semibold">{delivery.responseCode}</p></div>
                <div><p className="text-slate-400">Attempts</p><p className="mt-1 font-semibold">{delivery.attempts}</p></div>
                <div><p className="text-slate-400">Time</p><p className="mt-1 font-semibold">{delivery.timestamp}</p></div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addToast(
                    "Webhook replay queued",
                    delivery.id + " will be delivered with the same event ID.",
                    "info",
                  )
                }
              >
                <RotateCw className="size-4" />
                Replay
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
