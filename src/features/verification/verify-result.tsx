"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Landmark,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PublicHeader } from "@/features/verification/public-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonStyles } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { QrMark } from "@/components/shared/qr-mark";
import { LoadingState } from "@/components/shared/states";
import { DetailGrid } from "@/components/shared/detail-grid";
import { useDemo } from "@/store/demo-store";
import { guaranteeService } from "@/services/guarantee.service";
import { publicDemoReference } from "@/mocks/guarantees";
import { formatMoney } from "@/lib/utils";
import type { Guarantee } from "@/types";

export function VerifyResult({ reference }: { reference: string }) {
  const { guarantees } = useDemo();
  const [result, setResult] = useState<Guarantee | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedAt, setCheckedAt] = useState("01 Sep 2026, 09:46:12 EAT");

  useEffect(() => {
    let active = true;
    setLoading(true);
    guaranteeService
      .verify(guarantees, decodeURIComponent(reference))
      .then((guarantee) => {
        if (active) {
          setResult(guarantee);
          setCheckedAt("01 Sep 2026, " + new Date().toLocaleTimeString("en-GB") + " EAT");
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [guarantees, reference]);

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <PublicHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="size-3.5" />
          Verify another guarantee
        </Link>
        {loading ? (
          <LoadingState label="Checking registry and document integrity…" full />
        ) : result ? (
          <div className="mt-5">
            <Card className="overflow-hidden border-emerald-200">
              <div className="border-b border-emerald-200 bg-emerald-50 px-5 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                      Authentic EDGN registry record
                    </p>
                    <h1 className="mt-1 text-xl font-semibold text-slate-950">
                      Guarantee verified successfully
                    </h1>
                    <p className="mt-1.5 font-mono text-xs text-slate-500">
                      {result.verificationReference}
                    </p>
                  </div>
                  <StatusBadge status={result.status} />
                </div>
              </div>
              <div className="grid lg:grid-cols-[minmax(0,1fr)_270px]">
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">
                          Signature and document integrity confirmed
                        </p>
                        <p className="mt-1 text-xs leading-5 text-emerald-700">
                          The public reference points to the current signed registry version.
                        </p>
                      </div>
                    </div>
                  </div>
                  <DetailGrid
                    columns={2}
                    items={[
                      { label: "Guarantee ID", value: result.reference },
                      { label: "Current status", value: <StatusBadge status={result.status} /> },
                      { label: "Issuing bank", value: result.bank },
                      { label: "Guarantee type", value: result.type },
                      {
                        label: "Amount",
                        value: result.publicVisibleAmount
                          ? formatMoney(result.amount)
                          : "Protected by disclosure policy",
                      },
                      { label: "Issue date", value: result.issueDate },
                      { label: "Expiry date", value: result.expiryDate },
                      { label: "Registry version", value: "Version " + result.version },
                    ]}
                  />
                  <div className="mt-7 border-t border-slate-100 pt-5">
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 size-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Verification timestamp
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{checkedAt}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="flex flex-col items-center justify-center border-t border-slate-200 bg-slate-50 p-6 text-center lg:border-l lg:border-t-0">
                  <QrMark size={170} />
                  <p className="mt-4 text-xs font-semibold text-slate-800">
                    EDGN verification mark
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Re-scan at any time to retrieve the current status.
                  </p>
                </div>
              </div>
            </Card>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["Issuing institution", result.bank, Landmark],
                ["Validity", result.issueDate + " — " + result.expiryDate, CalendarDays],
                ["Integrity", "Signed version unchanged", ShieldCheck],
              ].map(([label, value, Icon]) => {
                const IconComponent = Icon as typeof Landmark;
                return (
                  <Card key={String(label)} className="p-4">
                    <IconComponent className="size-4 text-[#0f6f68]" />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {String(label)}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-800">
                      {String(value)}
                    </p>
                  </Card>
                );
              })}
            </div>
            <div className="mt-7 rounded-lg border border-slate-200 bg-white p-4 text-center text-xs leading-6 text-slate-500">
              This public view does not expose internal bank notes, collateral, applicant
              banking data, private evidence, or audit logs.
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <Card className="overflow-hidden border-rose-200">
              <div className="h-1.5 bg-rose-600" />
              <CardContent className="px-6 py-10 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                  <AlertTriangle className="size-7" />
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-rose-700">
                  No registry match
                </p>
                <h1 className="mt-2 text-xl font-semibold text-slate-950">
                  This verification reference was not found
                </h1>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                  Check every character against the signed document. A missing record does
                  not prove fraud, but it requires confirmation with the named issuing bank.
                </p>
                <div className="mx-auto mt-4 max-w-md rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">
                  {decodeURIComponent(reference)}
                </div>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/verify" className={buttonStyles("outline")}>
                    <Search className="size-4" />
                    Try another reference
                  </Link>
                  <Link
                    href={"/verify/" + publicDemoReference}
                    className={buttonStyles("primary")}
                  >
                    <RefreshCw className="size-4" />
                    View valid sample
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
