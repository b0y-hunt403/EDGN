"use client";

import { Bell, CheckCheck, Clock3, PlugZap, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { useDemo } from "@/store/demo-store";
import { cn } from "@/lib/utils";

const icons = {
  workflow: CheckCheck,
  security: ShieldCheck,
  expiry: Clock3,
  integration: PlugZap,
};

export function NotificationsPage() {
  const { notifications, markNotificationRead, addToast } = useDemo();
  return (
    <>
      <PageHeader
        eyebrow="Communication center"
        title="Notifications"
        description="Workflow, expiry, security, and integration notices for your current role."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              notifications.forEach((item) => markNotificationRead(item.id));
              addToast("Notifications updated", "All items are marked as read.");
            }}
          >
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <div className="divide-y divide-slate-100">
          {notifications.map((item) => {
            const Icon = icons[item.category];
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={cn(
                  "flex w-full gap-4 px-5 py-4 text-left transition hover:bg-slate-50",
                  !item.read && "bg-[#f2f9f7]/70",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                    item.category === "expiry"
                      ? "bg-amber-50 text-amber-700"
                      : item.category === "security"
                        ? "bg-violet-50 text-violet-700"
                        : item.category === "integration"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700",
                  )}
                >
                  <Icon className="size-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    {!item.read ? <span className="size-2 rounded-full bg-[#0f6f68]" /> : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.message}</p>
                  <p className="mt-1.5 text-xs font-medium text-slate-400">{item.time}</p>
                </div>
                <Bell className="mt-1 size-4 shrink-0 text-slate-300" />
              </button>
            );
          })}
        </div>
      </Card>
    </>
  );
}
