import { Check, Circle, Clock3 } from "lucide-react";
import type { TimelineEvent } from "@/types";
import { cn } from "@/lib/utils";

export function Timeline({
  events,
  compact = false,
}: {
  events: TimelineEvent[];
  compact?: boolean;
}) {
  return (
    <ol className="relative">
      {events.map((event, index) => {
        const tone = event.tone ?? "neutral";
        return (
          <li
            key={event.id}
            className={cn(
              "relative ml-3 border-l border-slate-200 pl-7",
              index === events.length - 1 ? "pb-0" : compact ? "pb-5" : "pb-7",
            )}
          >
            <span
              className={cn(
                "absolute -left-3 top-0 flex size-6 items-center justify-center rounded-full border-4 border-white",
                tone === "success"
                  ? "bg-emerald-600 text-white"
                  : tone === "warning"
                    ? "bg-amber-500 text-white"
                    : tone === "danger"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-300 text-white",
              )}
            >
              {tone === "success" ? (
                <Check className="size-3" />
              ) : tone === "warning" ? (
                <Clock3 className="size-3" />
              ) : (
                <Circle className="size-2 fill-current" />
              )}
            </span>
            <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {event.description}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {event.date} · {event.actor}
            </p>
          </li>
        );
      })}
    </ol>
  );
}