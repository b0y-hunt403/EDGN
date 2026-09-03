"use client";

import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useDemo } from "@/store/demo-store";

export function ToastViewport() {
  const { toasts, dismissToast } = useDemo();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((toast) => {
        const Icon =
          toast.tone === "success"
            ? CheckCircle2
            : toast.tone === "danger"
              ? AlertTriangle
              : Info;
        const color =
          toast.tone === "success"
            ? "text-success"
            : toast.tone === "danger"
              ? "text-dangerx"
              : "text-primary";
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-brd bg-card p-4 shadow-lg"
          >
            <Icon className={`h-5 w-5 shrink-0 ${color}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}