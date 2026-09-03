import {
  AlertCircle,
  FileSearch,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingState({
  label = "Loading…",
  full = false,
}: {
  label?: string;
  full?: boolean;
}) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center text-center " +
        (full ? "min-h-[70vh]" : "min-h-56")
      }
    >
      <div className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
        <LoaderCircle className="size-5 animate-spin text-[#0f6f68]" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

export function EmptyState({
  title = "No matching records",
  description = "Adjust your filters or search phrase and try again.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <FileSearch className="size-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}