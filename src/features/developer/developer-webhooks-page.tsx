"use client";

import { useState } from "react";
import { CheckCircle2, Plus, RotateCw, Send, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form-controls";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { webhookDeliveries, webhookEvents } from "@/mocks/developer";
import { developerService } from "@/services/developer.service";
import { useDemo } from "@/store/demo-store";
import type { WebhookDelivery } from "@/types";

export function DeveloperWebhooksPage() {
  const [tab, setTab] = useState("deliveries");
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>(webhookDeliveries);
  const [events, setEvents] = useState(webhookEvents);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const { addToast } = useDemo();

  const replay = async (delivery: WebhookDelivery) => {
    setBusy(delivery.id);
    try {
      const updated = await developerService.replayWebhook(delivery);
      setDeliveries((items) => items.map((item) => item.id === updated.id ? updated : item));
      addToast("Webhook delivered", updated.id + " · HTTP " + updated.responseCode);
    } finally { setBusy(null); }
  };

  return (
    <>
      <PageHeader eyebrow="Event-driven integration" title="Webhooks" description="Subscribe to lifecycle events, inspect deliveries, and replay safely." actions={<Button onClick={() => setOpen(true)}><Plus className="size-4" />Add endpoint</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Deliveries today", "1,284", Send], ["Success rate", "99.94%", CheckCircle2], ["Active subscriptions", String(events.filter((item) => item.enabled).length), Webhook]].map(([label, value, Icon]) => { const IconComponent = Icon as typeof Webhook; return <Card key={String(label)} className="flex items-center gap-4 p-4"><div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><IconComponent className="size-5" /></div><div><p className="text-xl font-semibold text-slate-950">{String(value)}</p><p className="text-xs text-slate-500">{String(label)}</p></div></Card>; })}
      </div>
      <Card className="mt-6 overflow-hidden">
        <Tabs value={tab} onValueChange={setTab} tabs={[{ value: "deliveries", label: "Delivery logs" }, { value: "subscriptions", label: "Event subscriptions" }, { value: "security", label: "Signing & security" }]} className="px-4 pt-2" />
        {tab === "deliveries" ? <div className="divide-y divide-slate-100">{deliveries.map((delivery) => <CardContent key={delivery.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center"><div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Webhook className="size-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-mono text-xs font-bold text-[#173b53]">{delivery.id}</p><StatusBadge status={delivery.status} /></div><p className="mt-1.5 text-sm font-semibold text-slate-900">{delivery.event}</p><p className="mt-1 truncate text-xs text-slate-500">{delivery.endpoint}</p></div><div className="grid grid-cols-3 gap-6 text-xs"><div><p className="text-slate-400">Response</p><p className="mt-1 font-semibold">{delivery.responseCode}</p></div><div><p className="text-slate-400">Attempts</p><p className="mt-1 font-semibold">{delivery.attempts}</p></div><div><p className="text-slate-400">Time</p><p className="mt-1 font-semibold">{delivery.timestamp}</p></div></div><Button variant="outline" size="sm" loading={busy === delivery.id} onClick={() => void replay(delivery)}><RotateCw className="size-4" />Replay</Button></CardContent>)}</div> : null}
        {tab === "subscriptions" ? <div className="divide-y divide-slate-100">{events.map((item) => <CardContent key={item.event} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="font-mono text-xs font-bold text-[#173b53]">{item.event}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></div><p className="text-xs text-slate-500">{item.deliveries} deliveries</p><button type="button" role="switch" aria-checked={item.enabled} onClick={() => setEvents((items) => items.map((event) => event.event === item.event ? { ...event, enabled: !event.enabled } : event))} className={(item.enabled ? "bg-[#0f6f68]" : "bg-slate-300") + " relative h-6 w-11 rounded-full transition"}><span className={(item.enabled ? "translate-x-5" : "translate-x-1") + " absolute left-0 top-1 size-4 rounded-full bg-white shadow transition"} /></button></CardContent>)}</div> : null}
        {tab === "security" ? <CardContent className="grid gap-5 p-6 lg:grid-cols-2"><div className="rounded-lg border border-slate-200 p-5"><p className="text-sm font-semibold text-slate-900">HMAC SHA-256 signatures</p><p className="mt-2 text-xs leading-5 text-slate-500">Each request includes <code>EDGN-Signature</code>, <code>EDGN-Timestamp</code>, and a stable event identifier. Reject timestamps outside a five-minute tolerance.</p></div><div className="rounded-lg border border-slate-200 p-5"><p className="text-sm font-semibold text-slate-900">Delivery guarantees</p><p className="mt-2 text-xs leading-5 text-slate-500">At-least-once delivery with exponential retry. Consumers should persist event IDs and process handlers idempotently.</p></div></CardContent> : null}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add webhook endpoint" description="Register an HTTPS endpoint in the presentation sandbox." footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setOpen(false); addToast("Webhook endpoint registered", "A signing secret and verification challenge were generated."); }}><Webhook className="size-4" />Register endpoint</Button></>}>
        <div className="space-y-5"><Field label="Endpoint name"><Input defaultValue="AACRA Contract Registry" /></Field><Field label="Endpoint URL"><Input defaultValue="https://sandbox.aacra.demo/edgn/events" /></Field><Field label="API client"><Select><option>AACRA Procurement Sandbox</option></Select></Field></div>
      </Modal>
    </>
  );
}
