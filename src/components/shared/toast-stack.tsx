"use client";

import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useDemo } from "@/store/demo-store";
import { cn } from "@/lib/utils";

export function ToastStack() {
  const { toasts, dismissToast } = useDemo();
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon =
          toast.tone === "success"
            ? CheckCircle2
            : toast.tone === "danger"
              ? XCircle
              : toast.tone === "warning"
                ? AlertTriangle
                : Info;
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex gap-3 rounded-xl border bg-card p-4 shadow-xl",
              toast.tone === "success"
                ? "border-success/30"
                : toast.tone === "danger"
                  ? "border-dangerx/30"
                  : toast.tone === "warning"
                    ? "border-amberx/30"
                    : "border-primary/30",
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 size-5 shrink-0",
                toast.tone === "success"
                  ? "text-success"
                  : toast.tone === "danger"
                    ? "text-dangerx"
                    : toast.tone === "warning"
                      ? "text-amberx"
                      : "text-primary",
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}