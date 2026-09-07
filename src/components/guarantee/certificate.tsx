import { BadgeCheck, Fingerprint, QrCode, ShieldCheck, Stamp } from "lucide-react";
import { QrMark } from "@/components/shared/qr-mark";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/utils";
import type { Guarantee } from "@/types";

export function GuaranteeCertificate({ guarantee }: { guarantee: Guarantee }) {
  const currentVersion = guarantee.versions.find(
    (version) => version.version === guarantee.version,
  );
  const signatory = currentVersion?.signedBy ?? "Authorized Signatory";
  const verificationUrl =
    (typeof window !== "undefined" ? window.location.origin : "https://edgn.gov.et") +
    "/verify/" +
    guarantee.verificationReference;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 bg-[#173b53] px-6 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-200/70">
            EDGN · Central Guarantee Registry
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Digital Guarantee Certificate
          </h2>
        </div>
        <div className="flex size-11 items-center justify-center rounded-lg bg-white/10 font-mono text-sm font-bold text-white">
          {guarantee.bank.slice(0, 3).toUpperCase()}
        </div>
      </div>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-[minmax(0,1fr)_170px]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Bank guarantee number
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-[#173b53]">
                {guarantee.bankGuaranteeNumber}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500">
                EDGN reference · {guarantee.reference}
              </p>
            </div>
            <StatusBadge status={guarantee.status} />
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: "#0f6f68" }}
              >
                {guarantee.bank.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {guarantee.bank}
                </p>
                <p className="text-[11px] text-slate-500">
                  {guarantee.branch} · Issuing Financial Institution
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-3 text-xs sm:grid-cols-2">
            <p className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span className="text-slate-500">Guarantee type</span>
              <strong className="text-slate-800">{guarantee.type}</strong>
            </p>
            <p className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span className="text-slate-500">Amount</span>
              <strong className="font-mono text-slate-800">
                {formatMoney(guarantee.amount)}
              </strong>
            </p>
            <p className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span className="text-slate-500">Applicant</span>
              <strong className="max-w-[60%] text-right text-slate-800">
                {guarantee.applicant}
              </strong>
            </p>
            <p className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span className="text-slate-500">Beneficiary</span>
              <strong className="max-w-[60%] text-right text-slate-800">
                {guarantee.beneficiary}
              </strong>
            </p>
            <p className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span className="text-slate-500">Tender / contract</span>
              <strong className="max-w-[65%] text-right font-mono text-slate-800">
                {guarantee.contractReference}
              </strong>
            </p>
            <p className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span className="text-slate-500">Issue date</span>
              <strong className="text-slate-800">{guarantee.issueDate}</strong>
            </p>
            <p className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span className="text-slate-500">Expiry date</span>
              <strong className="text-slate-800">{guarantee.expiryDate}</strong>
            </p>
            <p className="flex justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span className="text-slate-500">Claim period</span>
              <strong className="text-slate-800">90 days after expiry</strong>
            </p>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-3">
              <Fingerprint className="size-4 text-emerald-700" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-900">
                  Authorized signatory
                </p>
                <p className="mt-0.5 text-[11px] text-emerald-700">
                  {signatory} · {guarantee.bank}
                </p>
              </div>
            </div>
            <div className="mt-3 grid gap-3 border-t border-emerald-100 pt-3 text-[11px] sm:grid-cols-2">
              <p className="flex items-center gap-2 text-slate-600">
                <Stamp className="size-3.5 text-[#0f6f68]" />
                Digital signature attached · SHA-256 {currentVersion?.hash ?? "—"}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <BadgeCheck className="size-3.5 text-[#0f6f68]" />
                Registry version v{guarantee.version}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-100 p-4 text-center">
          <QrMark size={120} />
          <p className="font-mono text-[11px] text-slate-500">
            {guarantee.verificationReference}
          </p>
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
            <QrCode className="size-3" />
            Scan to verify
          </div>
          <p className="break-all text-[10px] leading-4 text-slate-400">
            {verificationUrl}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-3 text-[11px] text-slate-500">
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-[#0f6f68]" />
          This certificate authenticates a digitally issued guarantee on the EDGN
          registry.
        </p>
        <p>
          Issued {guarantee.issueDate === "—" ? "recently" : guarantee.issueDate} ·
          Version {guarantee.version}
        </p>
      </div>
    </div>
  );
}