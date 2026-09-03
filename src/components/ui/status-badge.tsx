import {
  AlertTriangle,
  Check,
  Circle,
  Clock3,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn, humanizeStatus } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "purple";

function toneForStatus(status: string): Tone {
  const value = status.toUpperCase();
  if (
    [
      "ACTIVE",
      "VERIFIED",
      "HEALTHY",
      "SUCCESS",
      "ISSUED",
      "SIGNED",
      "DELIVERED",
      "PUBLISHED",
      "ENABLED",
      "PAID",
      "RESERVED",
    ].some((term) => value.includes(term))
  )
    return "success";
  if (
    [
      "PENDING",
      "REVIEW",
      "EXPIRING",
      "RETRY",
      "WARNING",
      "MAINTENANCE",
      "DRAFT",
      "INVITED",
      "MONITORING",
    ].some((term) => value.includes(term))
  )
    return "warning";
  if (
    ["REJECTED", "FAILED", "DENIED", "DEGRADED", "DISABLED"].some((term) =>
      value.includes(term),
    )
  )
    return "danger";
  if (
    ["COURT", "DISPUTED", "JUDICIAL", "CONTROLLED"].some((term) =>
      value.includes(term),
    )
  )
    return "purple";
  if (["SUBMITTED", "UNDER_REVIEW"].some((term) => value.includes(term)))
    return "info";
  return "neutral";
}

const styles: Record<Tone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  purple: "border-violet-200 bg-violet-50 text-violet-700",
};

function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === "success") return <Check className="size-3" />;
  if (tone === "warning") return <Clock3 className="size-3" />;
  if (tone === "danger") return <X className="size-3" />;
  if (tone === "purple") return <ShieldCheck className="size-3" />;
  if (tone === "info") return <Circle className="size-2 fill-current" />;
  return <AlertTriangle className="size-3" />;
}

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const tone = toneForStatus(status);
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        styles[tone],
        className,
      )}
    >
      <ToneIcon tone={tone} />
      {label ?? humanizeStatus(status)}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const stylesByPriority = {
    Urgent: "border-rose-200 bg-rose-50 text-rose-700",
    High: "border-amber-200 bg-amber-50 text-amber-700",
    Normal: "border-slate-200 bg-white text-slate-600",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
        stylesByPriority[
          priority as keyof typeof stylesByPriority
        ] ?? stylesByPriority.Normal,
      )}
    >
      {priority}
    </span>
  );
}
