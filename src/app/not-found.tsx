import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0f6f68] shadow-sm">
          <Compass className="size-6" />
        </div>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f6f68]">
          Route not found
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          This demo screen does not exist
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Return to the Applicant dashboard or use Demo Mode to switch perspectives.
        </p>
        <Link href="/applicant" className={buttonStyles("primary") + " mt-5"}>
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
