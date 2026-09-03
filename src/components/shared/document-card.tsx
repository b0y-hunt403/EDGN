import { Download, FileCheck2, FileText, MoreHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DocumentRecord } from "@/types";

export function DocumentCard({
  document,
  onDownload,
}: {
  document: DocumentRecord;
  onDownload?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 last:border-b-0">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {document.status === "Verified" || document.status === "Signed" ? (
          <FileCheck2 className="size-5" />
        ) : (
          <FileText className="size-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {document.name}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {document.category} · {document.size} · {document.date}
        </p>
      </div>
      <StatusBadge status={document.status} />
      <button
        type="button"
        className="hidden size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 sm:flex"
        onClick={onDownload}
        aria-label={"Download " + document.name}
      >
        {onDownload ? <Download className="size-4" /> : <MoreHorizontal className="size-4" />}
      </button>
    </div>
  );
}