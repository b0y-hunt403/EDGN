"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Braces,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Gauge,
  KeyRound,
  LockKeyhole,
  Play,
  RotateCw,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart, VerticalBars } from "@/components/shared/charts";
import { PageHeader } from "@/components/shared/page-header";
import { CodeBlock } from "@/features/developer/code-block";
import { apiUsage, changelogEntries, endpointExamples, rateLimitTiers } from "@/mocks/developer";
import { developerService, type ExplorerResponse } from "@/services/developer.service";
import { useDemo } from "@/store/demo-store";

export type DeveloperReferenceView = "sandbox" | "usage" | "docs" | "explorer" | "authentication" | "changelog";

const authExample = "const tokenResponse = await fetch(\n  'https://sandbox.identity.edgn.gov.et/oauth2/token',\n  {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },\n    body: new URLSearchParams({\n      grant_type: 'client_credentials',\n      client_id: process.env.EDGN_CLIENT_ID,\n      client_secret: process.env.EDGN_CLIENT_SECRET,\n      scope: 'guarantees:verify'\n    })\n  }\n);\n\nconst { access_token } = await tokenResponse.json();";

export function DeveloperReferencePage({ view }: { view: DeveloperReferenceView }) {
  if (view === "usage") return <UsagePage />;
  if (view === "docs") return <DocumentationPage />;
  if (view === "authentication") return <AuthenticationPage />;
  if (view === "changelog") return <ChangelogPage />;
  return <ExplorerPage sandbox={view === "sandbox"} />;
}

function ExplorerPage({ sandbox }: { sandbox: boolean }) {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/api/v1/verify/EDGN-V-2026-004871");
  const [body, setBody] = useState('{\n  "reference": "EDGN-V-2026-004871"\n}');
  const [response, setResponse] = useState<ExplorerResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const { addToast } = useDemo();

  const run = async () => {
    setBusy(true);
    setResponse(null);
    try {
      const result = await developerService.runExplorer(path);
      setResponse(result);
      addToast("Sandbox request completed", "HTTP " + result.status + " · " + result.duration + " ms");
    } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader
        eyebrow={sandbox ? "Safe integration environment" : "Interactive API reference"}
        title={sandbox ? "Sandbox environment" : "Endpoint explorer"}
        description={sandbox ? "Run realistic EDGN scenarios using non-production credentials and demonstration records." : "Compose a request, inspect headers, and review a realistic typed response without calling a backend."}
        actions={<StatusBadge status="HEALTHY" label="Sandbox operational" />}
      />
      {sandbox ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[["Environment", "Sandbox", ServerCog], ["Base URL", "sandbox.api.edgn.gov.et", TerminalSquare], ["Data reset", "Daily · 02:00 EAT", RotateCw]].map(([label, value, Icon]) => { const IconComponent = Icon as typeof ServerCog; return <Card key={String(label)} className="flex items-center gap-4 p-4"><div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-[#173b53]"><IconComponent className="size-5" /></div><div className="min-w-0"><p className="text-xs text-slate-500">{String(label)}</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{String(value)}</p></div></Card>; })}
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
        <Card className="overflow-hidden">
          <CardHeader title="Request" description="Requests are executed by the frontend mock service." />
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
              <Field label="Method"><Select value={method} onChange={(event) => setMethod(event.target.value)}><option>GET</option><option>POST</option></Select></Field>
              <Field label="Path"><Input value={path} onChange={(event) => setPath(event.target.value)} /></Field>
            </div>
            <Field label="Authorization"><Input value="Bearer edgn_sandbox_demo_token_••••••••" disabled /></Field>
            {method !== "GET" ? <Field label="JSON body"><Textarea className="min-h-36 font-mono text-xs" value={body} onChange={(event) => setBody(event.target.value)} /></Field> : null}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">This explorer uses safe mock responses. No institutional record or external service is changed.</div>
            <Button className="w-full sm:w-auto" loading={busy} onClick={() => void run()}><Play className="size-4" />Send sandbox request</Button>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader title="Response" description={response ? response.requestId + " · " + response.duration + " ms" : "Run the request to inspect a response."} action={response ? <StatusBadge status="SUCCESS" label={String(response.status) + " OK"} /> : undefined} />
          <CardContent>
            {response ? <CodeBlock language="json" code={JSON.stringify(response.body, null, 2)} /> : <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center"><Braces className="size-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No response yet</p><p className="mt-1 max-w-64 text-xs leading-5 text-slate-500">Send the prepared request to see response headers, latency, and JSON.</p></div>}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 overflow-hidden">
        <CardHeader title="Sample sandbox records" description="Stable identifiers available for partner demonstrations." />
        <div className="grid divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[['Valid active guarantee', 'EDGN-V-2026-004871', 'Returns authentic: true'], ['Expiring guarantee', 'EDGN-V-2026-004867', 'Returns status: EXPIRING_SOON'], ['Unknown reference', 'EDGN-V-2026-000000', 'Returns 404 GUARANTEE_NOT_FOUND']].map(([title, reference, result]) => <button type="button" key={reference} onClick={() => { setMethod("GET"); setPath("/api/v1/verify/" + reference); setResponse(null); }} className="p-5 text-left transition hover:bg-slate-50"><p className="text-xs font-semibold text-slate-900">{title}</p><p className="mt-2 font-mono text-[11px] text-[#0f6f68]">{reference}</p><p className="mt-1 text-[11px] text-slate-500">{result}</p></button>)}
        </div>
      </Card>
    </>
  );
}

function UsagePage() {
  const { addToast } = useDemo();
  return (
    <>
      <PageHeader eyebrow="Operational telemetry" title="API usage & rate limits" description="Request volume, latency, error rates, quotas, and rate-limit policies for the selected institution." actions={<Button variant="outline" onClick={() => addToast("Usage report exported", "AACRA · September 2026 · CSV", "info")}><Activity className="size-4" />Export usage</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Requests MTD', '18,429', '+12.4%', Gauge], ['Successful', '18,425', '99.98%', CheckCircle2], ['Client errors', '3', '0.016%', Activity], ['p95 latency', '412 ms', '-28 ms', Clock3]].map(([label, value, helper, Icon]) => { const IconComponent = Icon as typeof Gauge; return <Card key={String(label)} className="p-5"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{String(label)}</p><IconComponent className="size-4 text-[#0f6f68]" /></div><p className="mt-2 text-2xl font-semibold text-slate-950">{String(value)}</p><p className="mt-2 text-xs text-slate-500">{String(helper)}</p></Card>; })}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
        <Card><CardHeader title="Monthly API requests" /><CardContent><VerticalBars data={apiUsage} /></CardContent></Card>
        <Card><CardHeader title="Requests by endpoint" /><CardContent><BarChart data={[{ label: "Guarantee verification", value: 9840, display: "53.4%" }, { label: "Guarantee retrieval", value: 5140, display: "27.9%" }, { label: "Claim status", value: 2219, display: "12.0%" }, { label: "Webhook management", value: 1230, display: "6.7%" }]} /></CardContent></Card>
      </div>
      <Card className="mt-6 overflow-hidden"><CardHeader title="Rate-limit allocation" description="Limits return standard Retry-After and EDGN-RateLimit headers." /><div className="divide-y divide-slate-100">{rateLimitTiers.map((tier) => <div key={tier.name} className="grid gap-3 px-5 py-4 text-xs sm:grid-cols-[1fr_1fr_100px_130px] sm:items-center"><div><p className="font-semibold text-slate-900">{tier.name}</p><p className="mt-1 text-slate-500">{tier.reset}</p></div><p className="font-mono text-slate-600">{tier.limit} · burst {tier.burst}</p><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0f6f68]" style={{ width: tier.current }} /></div><p className="font-semibold text-emerald-700">{tier.current} utilized</p></div>)}</div></Card>
    </>
  );
}

function DocumentationPage() {
  const [selected, setSelected] = useState(endpointExamples[0]);
  const response = '{\n  "reference": "EDGN-V-2026-004871",\n  "authentic": true,\n  "status": "ACTIVE",\n  "issuer": "Commercial Bank of Ethiopia",\n  "registryVersion": 2\n}';
  return (
    <>
      <PageHeader eyebrow="API reference · v1" title="API documentation" description="Versioned institutional contracts, request schemas, response projections, errors, and integration guidance." actions={<Button variant="outline"><ExternalLink className="size-4" />Download OpenAPI 3.1</Button>} />
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="h-fit overflow-hidden"><CardHeader title="Endpoints" /><div className="p-2">{endpointExamples.map((endpoint) => <button type="button" key={endpoint.method + endpoint.path} onClick={() => setSelected(endpoint)} className={(selected.path === endpoint.path ? "border-[#0f6f68]/30 bg-[#eaf5f2]" : "border-transparent hover:bg-slate-50") + " mb-1 w-full rounded-lg border p-3 text-left"}><div className="flex items-center gap-2"><span className={(endpoint.method === "GET" ? "text-emerald-700" : "text-blue-700") + " text-[10px] font-bold"}>{endpoint.method}</span><code className="truncate text-[10px] text-slate-600">{endpoint.path}</code></div><p className="mt-1.5 text-[11px] leading-4 text-slate-500">{endpoint.summary}</p></button>)}</div></Card>
        <Card className="overflow-hidden"><CardHeader title={selected.summary} description={selected.path} action={<StatusBadge status="STABLE" label="v1 · Stable" />} /><CardContent className="space-y-6">
          <section><h3 className="text-sm font-semibold text-slate-900">Authorization</h3><p className="mt-2 text-xs leading-5 text-slate-500">Requires OAuth 2.0 client credentials with the <code className="rounded bg-slate-100 px-1.5 py-1 text-[#173b53]">{selected.scope}</code> scope. Institutional record access is also constrained by organization membership.</p></section>
          <section><h3 className="text-sm font-semibold text-slate-900">Path parameters</h3><div className="mt-3 rounded-lg border border-slate-200"><div className="grid grid-cols-[130px_90px_1fr] border-b border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500"><span>Name</span><span>Type</span><span>Description</span></div><div className="grid grid-cols-[130px_90px_1fr] px-4 py-3 text-xs"><code>reference</code><span>string</span><span className="text-slate-500">Canonical EDGN or public verification reference.</span></div></div></section>
          <section><h3 className="mb-3 text-sm font-semibold text-slate-900">Example response · 200</h3><CodeBlock language="json" code={response} /></section>
          <section><h3 className="text-sm font-semibold text-slate-900">Standard errors</h3><div className="mt-3 grid gap-3 sm:grid-cols-3">{[['400', 'INVALID_REFERENCE'], ['401', 'UNAUTHORIZED'], ['404', 'GUARANTEE_NOT_FOUND']].map(([status, code]) => <div key={status} className="rounded-lg border border-slate-200 p-3"><p className="font-mono text-xs font-bold text-slate-800">{status}</p><p className="mt-1 font-mono text-[10px] text-slate-500">{code}</p></div>)}</div></section>
        </CardContent></Card>
      </div>
    </>
  );
}

function AuthenticationPage() {
  return (
    <>
      <PageHeader eyebrow="OAuth 2.0" title="Authentication" description="Secure institution-to-institution access using client credentials, scoped tokens, mTLS, and controlled secret rotation." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
        <Card><CardHeader title="Client credentials flow" description="Recommended for server-to-server integrations." /><CardContent className="space-y-6"><div className="grid gap-3 sm:grid-cols-3">{[["1", "Register client", "An institutional administrator approves scopes."], ["2", "Request token", "Exchange credentials over an mTLS channel."], ["3", "Call EDGN API", "Send the bearer token and request ID."]].map(([step, title, detail]) => <div key={step} className="rounded-lg border border-slate-200 p-4"><div className="flex size-7 items-center justify-center rounded-full bg-[#173b53] text-xs font-bold text-white">{step}</div><p className="mt-3 text-xs font-semibold text-slate-900">{title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{detail}</p></div>)}</div><CodeBlock language="typescript" code={authExample} /></CardContent></Card>
        <div className="space-y-5">
          <Card><CardHeader title="Security requirements" /><CardContent className="space-y-4">{[[ShieldCheck, "mTLS required", "Certificate-bound access for production clients."], [KeyRound, "Scoped tokens", "Least-privilege scopes with 15-minute lifetime."], [LockKeyhole, "Secret governance", "Rotation, revocation, and access audit events."]].map(([Icon, title, detail]) => { const IconComponent = Icon as typeof ShieldCheck; return <div key={String(title)} className="flex gap-3"><IconComponent className="mt-0.5 size-4 shrink-0 text-[#0f6f68]" /><div><p className="text-xs font-semibold text-slate-800">{String(title)}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{String(detail)}</p></div></div>; })}</CardContent></Card>
          <Card className="border-amber-200 bg-amber-50/60"><CardContent className="p-4 text-xs leading-5 text-amber-800"><strong>Never embed client secrets</strong> in browser or mobile application code. Exchange tokens from an institution-controlled backend service.</CardContent></Card>
        </div>
      </div>
    </>
  );
}

function ChangelogPage() {
  return (
    <>
      <PageHeader eyebrow="Platform evolution" title="API changelog" description="Additive improvements, deprecation notices, sandbox updates, and migration guidance." actions={<Button variant="outline"><Activity className="size-4" />Subscribe to updates</Button>} />
      <div className="grid gap-4">
        {changelogEntries.map((entry, index) => (
          <Card key={entry.version}><CardContent className="flex flex-col gap-5 p-5 sm:flex-row"><div className="w-36 shrink-0"><StatusBadge status={index === 0 ? "CURRENT" : "PUBLISHED"} label={index === 0 ? "Latest" : "Published"} /><p className="mt-2 font-mono text-[11px] text-slate-500">{entry.version}</p><p className="mt-1 text-[11px] text-slate-400">{entry.date}</p></div><div className="min-w-0 flex-1"><h2 className="text-sm font-semibold text-slate-900">{entry.title}</h2><ul className="mt-3 space-y-2">{entry.items.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-700" />{item}</li>)}</ul></div><Button variant="ghost" size="sm">Details <ArrowRight className="size-3.5" /></Button></CardContent></Card>
        ))}
      </div>
    </>
  );
}
