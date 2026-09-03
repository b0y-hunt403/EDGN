import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  trend = "neutral",
  helper,
  icon: Icon,
  tone = "slate",
}: {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  helper?: string;
  icon: LucideIcon;
  tone?: "teal" | "navy" | "amber" | "rose" | "slate" | "violet";
}) {
  const toneStyles = {
    teal: "bg-emerald-50 text-emerald-700",
    navy: "bg-blue-50 text-[#173b53]",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-600",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <Card className="min-w-0 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-slate-950">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            toneStyles[tone],
          )}
        >
          <Icon className="size-[18px]" />
        </div>
      </div>
      {change || helper ? (
        <div className="mt-3 flex min-h-5 items-center gap-1.5 text-xs">
          {change ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold",
                trend === "up"
                  ? "text-emerald-700"
                  : trend === "down"
                    ? "text-rose-700"
                    : "text-slate-600",
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="size-3" />
              ) : trend === "down" ? (
                <ArrowDownRight className="size-3" />
              ) : null}
              {change}
            </span>
          ) : null}
          {helper ? <span className="truncate text-slate-500">{helper}</span> : null}
        </div>
      ) : null}
    </Card>
  );
}