import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  trend?: number;
  trendGood?: "up" | "down" | "neutral";
  hint?: string;
  accent?: "teal" | "navy" | "success" | "warning" | "danger" | "violet";
}

const accents = {
  teal: "bg-[#e7f4f1] text-[#0f6f68]",
  navy: "bg-[#e8eef4] text-[#173b53]",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  violet: "bg-violet-50 text-violet-700",
};

export function MetricCard({ label, value, icon: Icon, trend, trendGood = "up", hint, accent = "teal" }: MetricCardProps) {
  const good =
    trend === undefined
      ? true
      : trendGood === "neutral"
      ? true
      : trend > 0
      ? trendGood === "up"
      : trendGood === "down";
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-slate-900">{value}</span>
          </div>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(trend !== undefined || hint) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                good ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(trend)}%
            </span>
          )}
          {hint && <span className="text-slate-500">{hint}</span>}
        </div>
      )}
    </Card>
  );
}

export { Card };