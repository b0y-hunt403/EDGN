"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Building2,
  Check,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-controls";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDemo } from "@/store/demo-store";

export function ProfilePage() {
  const { currentUser, addToast } = useDemo();
  const [phone, setPhone] = useState("+251 911 284 739");
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile & organization"
        description="Representative details, organization verification, and preferences."
      />
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardContent className="p-6 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-xl bg-[#173b53] text-xl font-bold text-white">
              {currentUser.initials}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">{currentUser.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{currentUser.title}</p>
            <StatusBadge status="VERIFIED" label="Verified representative" className="mt-4" />
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-left">
              <p className="flex items-center gap-3 text-xs text-slate-600">
                <Building2 className="size-4 text-slate-400" />
                {currentUser.organization}
              </p>
              <p className="flex items-center gap-3 text-xs text-slate-600">
                <Mail className="size-4 text-slate-400" />
                {currentUser.email}
              </p>
              <p className="flex items-center gap-3 text-xs text-slate-600">
                <MapPin className="size-4 text-slate-400" />
                {currentUser.location}
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Representative details" description="Information used for authorized workflow communication." />
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name">
                <Input value={currentUser.name} onChange={() => undefined} />
              </Field>
              <Field label="Job title">
                <Input value={currentUser.title} onChange={() => undefined} />
              </Field>
              <Field label="Email address">
                <Input value={currentUser.email} disabled />
              </Field>
              <Field label="Mobile number">
                <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
              </Field>
              <Field label="Preferred language">
                <Select defaultValue="English">
                  <option>English</option>
                  <option>አማርኛ</option>
                </Select>
              </Field>
              <Field label="Primary location">
                <Input value={currentUser.location} onChange={() => undefined} />
              </Field>
              <div className="sm:col-span-2 flex justify-end">
                <Button onClick={() => addToast("Profile updated", "Your demonstration profile changes were saved.")}>
                  <Save className="size-4" />
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Organization verification" />
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Organization", currentUser.organization, Building2],
                  ["Verification", "Verified", BadgeCheck],
                  ["Authority", "Active representative", UserRound],
                ].map(([label, value, Icon]) => {
                  const IconComponent = Icon as typeof Check;
                  return (
                    <div key={String(label)} className="rounded-lg border border-slate-200 p-4">
                      <IconComponent className="size-4 text-[#0f6f68]" />
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {String(label)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-800">{String(value)}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
