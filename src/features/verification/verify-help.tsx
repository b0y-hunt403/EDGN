import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  FileSearch,
  LockKeyhole,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { PublicHeader } from "@/features/verification/public-header";
import { Card, CardContent } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";

export function VerifyHelp() {
  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <PublicHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500"
        >
          <ArrowLeft className="size-3.5" />
          Back to verification
        </Link>
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f6f68]">
            Public guidance
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            How EDGN verification works
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            A verification result confirms the current public-safe registry record. It does
            not replace the signed guarantee terms or the issuing bank.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            [QrCode, "1. Find the reference", "Use the QR or EDGN-V reference on the signed guarantee."],
            [FileSearch, "2. Check the registry", "EDGN retrieves only the approved public verification projection."],
            [LockKeyhole, "3. Confirm integrity", "Review status, issuing bank, dates, type, and integrity result."],
          ].map(([Icon, title, description]) => {
            const IconComponent = Icon as typeof QrCode;
            return (
              <Card key={String(title)}>
                <CardContent className="p-5">
                  <IconComponent className="size-5 text-[#0f6f68]" />
                  <h2 className="mt-4 text-sm font-semibold text-slate-900">
                    {String(title)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {String(description)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Card className="mt-6 border-amber-200 bg-amber-50/60">
          <CardContent className="flex gap-4 p-5">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <div>
              <h2 className="text-sm font-semibold text-amber-950">
                If the reference is not found
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Recheck the reference, do not rely on the presented copy, and contact the
                issuing bank through an independently verified channel.
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
          <Link href="/verify" className={buttonStyles("primary")}>
            <ShieldCheck className="size-4" />
            Verify a guarantee
          </Link>
        </div>
      </main>
    </div>
  );
}
