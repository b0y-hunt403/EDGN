"use client";

import {
  CheckCircle2,
  Fingerprint,
  KeyRound,
  Laptop,
  LogOut,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDemo } from "@/store/demo-store";

export function SecurityPage() {
  const { addToast } = useDemo();
  return (
    <>
      <PageHeader
        eyebrow="Account security"
        title="Security & sessions"
        description="MFA, credential, and active-session controls."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Security posture" description="Your account meets the current role policy." />
          <CardContent className="space-y-4">
            {[
              {
                icon: Fingerprint,
                title: "Multi-factor authentication",
                detail: "Authenticator app · verified 18 Aug 2026",
                status: "Enabled",
              },
              {
                icon: KeyRound,
                title: "Account credential",
                detail: "Last changed 46 days ago",
                status: "Healthy",
              },
              {
                icon: ShieldCheck,
                title: "Step-up authentication",
                detail: "Required for sensitive approvals and exports",
                status: "Enabled",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <item.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Active sessions" description="Two verified sessions are active." />
          <CardContent className="space-y-4">
            <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <Laptop className="mt-0.5 size-5 text-emerald-700" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">Chrome on Linux</p>
                  <StatusBadge status="ACTIVE" label="Current" />
                </div>
                <p className="mt-1 text-xs text-slate-500">Addis Ababa · 01 Sep 2026, 09:41</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-slate-200 p-4">
              <Smartphone className="mt-0.5 size-5 text-slate-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">Mobile browser</p>
                <p className="mt-1 text-xs text-slate-500">Addis Ababa · 31 Aug 2026, 18:22</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addToast("Session revoked", "The mobile demo session was closed.", "warning")}
              >
                <LogOut className="size-4" />
                Revoke
              </Button>
            </div>
            <div className="flex gap-3 rounded-lg bg-slate-50 p-4">
              <CheckCircle2 className="mt-0.5 size-4 text-[#0f6f68]" />
              <p className="text-xs leading-5 text-slate-600">
                Production authentication is intentionally not connected in this frontend demonstration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
