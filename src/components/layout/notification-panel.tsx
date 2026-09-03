"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Clock3,
  PlugZap,
  ShieldCheck,
} from "lucide-react";
import { useDemo } from "@/store/demo-store";
import { cn } from "@/lib/utils";

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const { notifications, markNotificationRead } = useDemo();
  const unread = notifications.filter((item) => !item.read).length;

  const iconFor = {
    workflow: CheckCheck,
    security: ShieldCheck,
    expiry: Clock3,
    integration: PlugZap,
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:text-slate-900"
        aria-label="Notifications"
      >
        <Bell className="size-[18px]" />
        {unread > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-[8px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Close notifications"
          />
          <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {unread} require attention
                </p>
              </div>
              <AlertTriangle className="size-4 text-amber-600" />
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {notifications.slice(0, 5).map((item) => {
                const Icon = iconFor[item.category];
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      markNotificationRead(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-slate-50",
                      !item.read && "bg-[#f2f9f7]",
                    )}
                  >
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-[11px] leading-4 text-slate-500">
                        {item.message}
                      </p>
                      <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                        {item.time}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
