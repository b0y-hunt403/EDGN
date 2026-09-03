"use client";

import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  MoreHorizontal,
  PlugZap,
  RefreshCw,
  ServerCog,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { DetailDrawer } from "@/components/shared/detail-drawer";
import { useDemo } from "@/store/demo-store";
import type { IntegrationRecord } from "@/types";

export function IntegrationMonitor() {
  const { integrations, addToast } = useDemo();
  const [selected, setSelected] = useState<IntegrationRecord | null>(null);
  return (
    <>
      <PageHeader
        eyebrow="Integration operations"
        title="Integration health"
        description="Bank, identity, signature, and judicial adapter status with telemetry."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              addToast("Health checks complete", "All seven adapter checks were refreshed.")
            }
          >
            <RefreshCw className="size-4" />
            Refresh checks
          </Button>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Healthy integrations", "5", CheckCircle2, "text-emerald-700 bg-emerald-50"],
          ["Degraded", "1", Activity, "text-amber-700 bg-amber-50"],
          ["Maintenance", "1", ServerCog, "text-blue-700 bg-blue-50"],
        ].map(([label, value, Icon, style]) => {
          const IconComponent = Icon as typeof Activity;
          return (
            <Card key={String(label)} className="flex items-center gap-4 p-4">
              <div className={"flex size-10 items-center justify-center rounded-lg " + style}>
                <IconComponent className="size-5" />
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-950">{String(value)}</p>
                <p className="text-xs text-slate-500">{String(label)}</p>
              </div>
            </Card>
          );
        })}
      </div>
      <Card className="overflow-hidden">
        <CardHeader title="Configured adapters" />
        <div className="divide-y divide-slate-100">
          {integrations.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setSelected(item)}
              className="flex w-full flex-col gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <PlugZap className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.category}</p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-xs sm:text-right">
                <div>
                  <p className="text-slate-400">Availability</p>
                  <p className="mt-1 font-semibold text-slate-700">{item.availability}</p>
                </div>
                <div>
                  <p className="text-slate-400">Latency</p>
                  <p className="mt-1 font-semibold text-slate-700">{item.latency}</p>
                </div>
                <div>
                  <p className="text-slate-400">Last event</p>
                  <p className="mt-1 font-semibold text-slate-700">{item.lastEvent}</p>
                </div>
              </div>
              <StatusBadge status={item.status} />
              <MoreHorizontal className="size-4 text-slate-400" />
            </button>
          ))}
        </div>
      </Card>
      <DetailDrawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        description={selected?.category}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() =>
                addToast("Connection tested", "mTLS and application health checks passed.")
              }
            >
              Test connection
            </Button>
            <Button onClick={() => addToast("Configuration opened", "Secret values remain protected.", "info")}>
              Edit configuration
            </Button>
          </>
        }
      >
        {selected ? (
          <div className="space-y-4">
            {[
              ["Status", selected.status],
              ["Availability", selected.availability],
              ["Median latency", selected.latency],
              ["Last event", selected.lastEvent],
              ["Authentication", "mTLS + OAuth 2.0 client credentials"],
              ["Retry policy", "5 attempts · exponential backoff"],
              ["Environment", "Presentation sandbox"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-1.5 text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </DetailDrawer>
    </>
  );
}
