import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";

export interface ActivityItem {
  id: string;
  text: string;
  at: string;
  actor?: string;
  icon: "submit" | "approval" | "claim" | "dispute" | "issued" | "system";
}

const iconColor: Record<ActivityItem["icon"], string> = {
  submit: "bg-primary-muted text-primary",
  approval: "bg-success-bg text-success",
  claim: "bg-danger-bg text-dangerx",
  dispute: "bg-amber-bg text-amberx",
  issued: "bg-indigo-bg text-indigox",
  system: "bg-slate-bg text-slatex",
};

const iconDot: Record<ActivityItem["icon"], string> = {
  submit: "bg-primary",
  approval: "bg-success",
  claim: "bg-dangerx",
  dispute: "bg-amberx",
  issued: "bg-indigox",
  system: "bg-slatex",
};

export function ActivityFeed({ items, formatDate }: { items: ActivityItem[]; formatDate?: (iso: string) => string }) {
  const fmt = formatDate ?? formatDateTime;
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", iconDot[item.icon])} />
          <div className="min-w-0">
            <p className="text-sm text-foreground">{item.text}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {fmt(item.at)}
              {item.actor ? ` · ${item.actor}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
