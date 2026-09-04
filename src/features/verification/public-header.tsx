import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="border-b border-white/10 bg-[#162f3d]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/verify" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-[10px] border border-white/15 bg-white/10 text-[#62d2bd]">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-base font-bold tracking-[0.12em] text-white">EDGN</p>
            <p className="text-[9px] uppercase tracking-[0.13em] text-slate-400">
              Public Verification
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/verify/help"
            className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/8 hover:text-white sm:block"
          >
            Verification help
          </Link>
          <Link
            href="/login"
            className="ml-1 inline-flex items-center gap-2 rounded-lg border border-[#62d2bd]/25 bg-[#62d2bd]/10 px-3 py-2 text-xs font-semibold text-[#a2e4d7]"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
