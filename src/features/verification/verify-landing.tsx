"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  FileSearch,
  LockKeyhole,
  QrCode,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PublicHeader } from "@/features/verification/public-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { Card, CardContent } from "@/components/ui/card";
import { QrMark } from "@/components/shared/qr-mark";
import { publicDemoReference } from "@/mocks/guarantees";

export function VerifyLanding() {
  const [reference, setReference] = useState(publicDemoReference);
  const [showScanner, setShowScanner] = useState(false);
  const router = useRouter();

  const verify = () => {
    const value = reference.trim() || "not-found";
    router.push("/verify/" + encodeURIComponent(value));
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <PublicHeader />
      <main>
        <section className="bg-[#162f3d] pb-28 pt-14 text-white sm:pt-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#62d2bd]/25 bg-[#62d2bd]/8 px-3 py-1.5 text-[11px] font-semibold text-[#9be1d3]">
              <ShieldCheck className="size-3.5" />
              Trusted digital guarantee registry
            </div>
            <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Verify a bank guarantee with confidence
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Confirm authenticity and current registry status using the secure EDGN
              reference printed on the signed guarantee.
            </p>
            <div className="mx-auto mt-8 max-w-2xl rounded-xl bg-white p-2 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && verify()}
                    className="h-12 border-transparent bg-white pl-11 font-mono text-sm focus:border-transparent"
                    placeholder="EDGN-V-2026-004871"
                    aria-label="Verification reference"
                  />
                </div>
                <Button size="lg" className="h-12 px-6" onClick={verify}>
                  Verify authenticity
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setShowScanner((value) => !value)}
                className="inline-flex items-center gap-2 font-semibold text-[#9be1d3] hover:underline"
              >
                <Camera className="size-4" />
                Scan sample QR
              </button>
              <span className="hidden sm:inline">•</span>
              <button
                type="button"
                onClick={() => {
                  setReference("EDGN-V-NOT-FOUND");
                  router.push("/verify/EDGN-V-NOT-FOUND");
                }}
                className="hover:text-white"
              >
                Demonstrate an invalid result
              </button>
            </div>
          </div>
        </section>

        {showScanner ? (
          <section className="relative z-10 mx-auto -mt-20 max-w-sm px-4">
            <Card className="border-[#0f6f68]/20 shadow-xl">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="overflow-hidden rounded-xl border border-[#0f6f68]/30 bg-slate-950 p-5">
                  <QrMark size={170} />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Sample QR detected
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {publicDemoReference}
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => router.push("/verify/" + publicDemoReference)}
                >
                  Open verification result
                </Button>
              </CardContent>
            </Card>
          </section>
        ) : null}

        <section className={showScanner ? "pb-16 pt-12" : "pb-16 pt-16"}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: FileSearch,
                  title: "Registry match",
                  description:
                    "Confirms the reference exists in the controlled EDGN registry.",
                },
                {
                  icon: LockKeyhole,
                  title: "Document integrity",
                  description:
                    "Validates that the signed version has not been changed.",
                },
                {
                  icon: CheckCircle2,
                  title: "Current status",
                  description:
                    "Shows active, expired, released, or other approved public status.",
                },
              ].map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-6">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#eaf5f2] text-[#0f6f68]">
                      <item.icon className="size-5" />
                    </div>
                    <h2 className="mt-4 text-sm font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-center text-center">
              <QrCode className="size-5 text-[#0f6f68]" />
              <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">
                Public verification intentionally excludes collateral, applicant banking
                details, private evidence, internal notes, and audit records.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>EDGN Frontend Demonstration · 1 September 2026</span>
          <span>Mock data · not a live banking verification service</span>
        </div>
      </footer>
    </div>
  );
}
