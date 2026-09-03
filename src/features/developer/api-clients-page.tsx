"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, KeyRound, Plus, RotateCw, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox, Field, Input, Select } from "@/components/ui/form-controls";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { apiClients } from "@/mocks/developer";
import { developerService } from "@/services/developer.service";
import { useDemo } from "@/store/demo-store";
import type { ApiClient } from "@/types";

export function ApiClientsPage() {
  const [clients, setClients] = useState<ApiClient[]>(apiClients);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("AACRA Contract Registry Demo");
  const [scope, setScope] = useState(true);
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { addToast } = useDemo();

  const create = async () => {
    setBusy(true);
    try {
      const result = await developerService.createClient(name);
      setClients((items) => [result.client, ...items]);
      setSecret(result.secret);
      setRevealed(true);
      addToast("Sandbox API client created", result.client.id + " · secret shown once");
    } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader eyebrow="Credentials" title="API clients" description="Create and govern OAuth 2.0 clients, environments, scopes, and rotation." actions={<Button onClick={() => { setOpen(true); setSecret(null); }}><Plus className="size-4" />Create API client</Button>} />
      <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800"><strong>Sandbox simulation:</strong> displayed secrets are demonstration values only. Production credentials would be generated inside an HSM-backed secret workflow.</div>
      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardContent className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#173b53]"><KeyRound className="size-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-slate-900">{client.name}</p><StatusBadge status={client.status} /><StatusBadge status={client.environment} label={client.environment} /></div>
                <p className="mt-1 font-mono text-[11px] text-slate-500">{client.id}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{client.scopes.map((item) => <span key={item} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-600">{item}</span>)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                <span className="text-slate-400">Usage</span><span className="font-semibold text-slate-700">{client.requests}</span>
                <span className="text-slate-400">Last used</span><span className="font-semibold text-slate-700">{client.lastUsed}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => void developerService.rotateSecret().then((result) => { setSecret(result.secret); setOpen(true); setRevealed(true); addToast("Client secret rotated", "The prior secret is now invalid in this simulation.", "warning"); })}><RotateCw className="size-4" />Rotate</Button>
                <Button variant="ghost" size="sm" onClick={() => { setClients((items) => items.map((item) => item.id === client.id ? { ...item, status: item.status === "Active" ? "Suspended" : "Active" } : item)); addToast(client.status === "Active" ? "Client suspended" : "Client activated", client.name, client.status === "Active" ? "warning" : "success"); }}><ShieldCheck className="size-4" />{client.status === "Active" ? "Suspend" : "Activate"}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={secret ? "API client credential" : "Create API client"} description={secret ? "Copy this sandbox secret now; it will not be displayed again." : "Register a scoped client for the EDGN sandbox."} footer={secret ? <Button onClick={() => setOpen(false)}>I have saved the secret</Button> : <><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button loading={busy} onClick={() => void create()}><KeyRound className="size-4" />Create client</Button></>}>
        {secret ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">This value is shown once in the real workflow. Store it in your institution's approved secret manager.</div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 p-3"><code className="min-w-0 flex-1 truncate text-xs text-slate-800">{revealed ? secret : "••••••••••••••••••••••••••••"}</code><Button variant="ghost" size="sm" className="size-8 p-0" onClick={() => setRevealed((value) => !value)}>{revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button><Button variant="ghost" size="sm" className="size-8 p-0" onClick={() => { void navigator.clipboard?.writeText(secret); addToast("Secret copied", "Store it securely before closing this dialog.", "info"); }}><Copy className="size-4" /></Button></div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><Check className="size-4" />Client registered in the sandbox environment</div>
          </div>
        ) : (
          <div className="space-y-5">
            <Field label="Client name" required><Input value={name} onChange={(event) => setName(event.target.value)} /></Field>
            <Field label="Environment"><Select><option>Sandbox</option></Select></Field>
            <Checkbox checked={scope} onChange={setScope} label="guarantees:verify" description="Verify a guarantee using the public-safe response projection." />
            <Checkbox checked={false} onChange={() => addToast("Scope request noted", "Additional scopes require organization approval.", "info")} label="guarantees:read" description="Read authorized guarantee records belonging to this institution." />
          </div>
        )}
      </Modal>
    </>
  );
}
