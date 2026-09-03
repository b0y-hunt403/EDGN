"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, ExternalLink, PlayCircle, RotateCcw, Users } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { useDemo } from "@/store/demo-store";

const journey = [
  { role: "Applicant", href: "/applicant/applications/new", title: "Create and submit a guarantee request", reference: "APP-2026-00942" },
  { role: "Bank Maker", href: "/bank/work-queue", title: "Review the submitted request and send to checker", reference: "APP-2026-00942" },
  { role: "Bank Checker", href: "/bank/approvals", title: "Approve the independently prepared application", reference: "APP-2026-00942" },
  { role: "Bank Signatory", href: "/bank/signatures", title: "Simulate signature and issue the guarantee", reference: "APP-2026-00942" },
  { role: "Public", href: "/verify", title: "Verify the newly issued or seeded guarantee", reference: "EDGN-V-2026-004871" },
  { role: "EDGN Admin", href: "/admin", title: "Review network, security, and integration health", reference: "Platform operations" },
];

export function DemoHelp() {
  const { resetDemo, busyAction, addToast } = useDemo();
  return (
    <>
      <PageHeader eyebrow="Presenter workspace" title="EDGN demonstration guide" description="A concise, connected route through the platform's applicant, bank, public, administration, judicial, and developer experiences." actions={<Button variant="outline" loading={busyAction === "reset-demo"} onClick={() => void resetDemo()}><RotateCcw className="size-4" />Reset demo state</Button>} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden"><CardHeader title="Recommended end-to-end presentation" description="Allow about 10–12 minutes for the core connected workflow." /><div className="divide-y divide-slate-100">{journey.map((item, index) => <Link key={item.role} href={item.href} className="group flex gap-4 px-5 py-4 transition hover:bg-slate-50"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#173b53] text-xs font-bold text-white">{index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold uppercase tracking-wider text-[#0f6f68]">{item.role}</p><span className="font-mono text-[10px] text-slate-400">{item.reference}</span></div><p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p></div><ArrowRight className="mt-2 size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600" /></Link>)}</div></Card>
        <div className="space-y-5">
          <Card><CardHeader title="Presenter controls" /><CardContent className="space-y-4">{[[Users, "Role switcher", "Use Demo as in the top bar. Navigation and user identity update together."], [PlayCircle, "Connected workflow", "The seeded application preserves status changes in local browser storage."], [BookOpenCheck, "Demo labels", "The interface clearly identifies simulations and external-system boundaries."]].map(([Icon, title, detail]) => { const IconComponent = Icon as typeof Users; return <div key={String(title)} className="flex gap-3"><IconComponent className="mt-0.5 size-4 shrink-0 text-[#0f6f68]" /><div><p className="text-xs font-semibold text-slate-800">{String(title)}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{String(detail)}</p></div></div>; })}</CardContent></Card>
          <Card className="border-emerald-200 bg-emerald-50/60"><CardContent className="flex gap-3 p-4"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" /><div><p className="text-xs font-semibold text-emerald-900">Best public reference</p><p className="mt-1 font-mono text-[11px] text-emerald-700">EDGN-V-2026-004871</p><Link href="/verify/EDGN-V-2026-004871" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800">Open verification <ExternalLink className="size-3" /></Link></div></CardContent></Card>
          <button type="button" onClick={() => addToast("Presenter note saved", "Notes stay local in this frontend demonstration.", "info")} className={buttonStyles("outline") + " w-full"}>Save presenter checkpoint</button>
        </div>
      </div>
    </>
  );
}
