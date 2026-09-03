import { ShieldCheck } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-white/15 bg-white/10 text-[#62d2bd]">
        <ShieldCheck className="size-5" />
      </div>
      {!compact ? (
        <div className="min-w-0">
          <p className="text-[17px] font-bold tracking-[0.12em] text-white">EDGN</p>
          <p className="truncate text-[9px] font-medium uppercase tracking-[0.14em] text-slate-400">
            Digital Guarantee Network
          </p>
        </div>
      ) : null}
    </div>
  );
}
