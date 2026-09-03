"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/form-controls";
import { Modal } from "@/components/ui/modal";
import { useDemo } from "@/store/demo-store";
import { StatusBadge } from "@/components/ui/status-badge";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { guarantees, applications, currentUser } = useDemo();
  const router = useRouter();

  const normalized = query.toLowerCase().trim();
  const guaranteeResults = useMemo(
    () =>
      guarantees
        .filter((item) =>
          [
            item.reference,
            item.applicant,
            item.beneficiary,
            item.contractReference,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
        )
        .slice(0, 4),
    [guarantees, normalized],
  );
  const applicationResults = useMemo(
    () =>
      applications
        .filter((item) =>
          [item.reference, item.applicant, item.beneficiary, item.contractReference]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
        )
        .slice(0, 3),
    [applications, normalized],
  );

  const portal = currentUser.portal;
  const openGuarantee = (id: string) => {
    const safePortal =
      portal === "admin" || portal === "developer" || portal === "court"
        ? "admin"
        : portal;
    setOpen(false);
    router.push("/" + safePortal + "/guarantees/" + id);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-10 min-w-[280px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition hover:border-slate-300 hover:bg-white md:flex"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search references or organizations</span>
        <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
          /
        </kbd>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 md:hidden"
        aria-label="Search"
      >
        <Search className="size-4" />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Search EDGN"
        description="Search the demonstration registry and active workflow."
        size="lg"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try EDGN-2026-004871 or Meskel Construction"
            className="h-11 pl-10"
          />
        </div>
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Guarantees
          </p>
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {guaranteeResults.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => openGuarantee(item.id)}
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50"
              >
                <ShieldCheck className="size-4 shrink-0 text-[#0f6f68]" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900">{item.reference}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    {item.applicant} · {item.beneficiary}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Applications
          </p>
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {applicationResults.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-3">
                <FileCheck2 className="size-4 shrink-0 text-slate-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900">{item.reference}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    {item.applicant} · {item.type}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
