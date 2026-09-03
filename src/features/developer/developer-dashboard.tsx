"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Braces,
  CheckCircle2,
  Clock3,
  KeyRound,
  ServerCog,
  Webhook,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonStyles } from "@/components/ui/button";
import { CodeBlock } from "@/features/developer/code-block";
import { apiClients, apiProducts, webhookDeliveries } from "@/mocks/developer";

const quickstart = "curl --request GET \\\n+  --url https://sandbox.api.edgn.gov.et/api/v1/verify/EDGN-V-2026-004871 \\\n+  --header 'Authorization: Bearer $EDGN_ACCESS_TOKEN' \\\n+  --header 'Accept: application/json'";

export function DeveloperDashboard() {
  return (
    <>
      <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Braces className="size-4" /></div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-emerald-800">Sandbox environment</p>
            <p className="mt-0.5 text-xs text-emerald-700">All sandbox systems operational</p>
          </div>
          <StatusBadge status="HEALTHY" />
        </div>
      </div>
      <PageHeader
        eyebrow="Institutional integration"
        title="Developer overview"
        description="Credentials, usage telemetry, guides, endpoint exploration, and event delivery."
        actions={<Link href="/developer/explorer" className={buttonStyles("primary")}><Braces className="size-4" />Open endpoint explorer</Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="API requests MTD" value="18,429" change="+12.4%" trend="up" icon={Activity} tone="teal" />
        <StatCard label="Success rate" value="99.98%" helper="Last 30 days" icon={CheckCircle2} tone="teal" />
        <StatCard label="Median latency" value="184 ms" helper="p95 · 412 ms" icon={Clock3} tone="navy" />
        <StatCard label="Active clients" value={String(apiClients.filter((item) => item.status === "Active").length)} helper="1 sandbox · 1 production" icon={KeyRound} tone="violet" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)]">
        <Card>
          <CardHeader title="Make your first verification request" description="OAuth 2.0 client credentials · sandbox base URL" action={<Link href="/developer/docs" className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f6f68]">Read documentation <ArrowRight className="size-3" /></Link>} />
          <CardContent><CodeBlock code={quickstart} /></CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader title="Recent webhook deliveries" action={<Link href="/developer/webhooks" className="text-xs font-semibold text-[#0f6f68]">View all</Link>} />
          <div className="divide-y divide-slate-100">
            {webhookDeliveries.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Webhook className="size-3.5" /></div>
                <div className="min-w-0 flex-1"><p className="truncate font-mono text-xs font-semibold text-slate-800">{item.event}</p><p className="mt-0.5 text-[11px] text-slate-400">{item.timestamp} · HTTP {item.responseCode}</p></div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <CardHeader title="Available API products" description="Versioned contracts designed for regulated institutional integrations." />
        <div className="grid divide-y divide-slate-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {apiProducts.map((product) => (
            <div key={product.name} className="p-5">
              <div className="flex items-center justify-between gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-[#173b53]"><ServerCog className="size-4" /></div><StatusBadge status={product.status} /></div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{product.name}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{product.description}</p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500"><span>Version {product.version}</span><span>{product.availability} availability</span></div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
