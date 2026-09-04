"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  FlaskConical,
  RotateCcw,
  UsersRound,
} from "lucide-react";
import { demoUsers, roleLabels } from "@/mocks/users";
import { roleHome } from "@/config/roles";
import { useDemo } from "@/store/demo-store";
import { useAuth } from "@/store/auth-store";
import type { DemoRoleId } from "@/types";
import { cn } from "@/lib/utils";

const roles = Object.keys(roleLabels) as DemoRoleId[];

export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { role, currentUser, setRole, resetDemo, busyAction } = useDemo();
  const { switchUserRole } = useAuth();
  const router = useRouter();

  const chooseRole = (nextRole: DemoRoleId) => {
    setRole(nextRole);
    switchUserRole(nextRole);
    setOpen(false);
    router.push(roleHome[nextRole]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 max-w-[230px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-left shadow-sm transition hover:border-slate-300"
        aria-expanded={open}
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#e7f4f1] text-[#0f6f68]">
          <FlaskConical className="size-4" />
        </div>
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f6f68]">
            Demo as {roleLabels[role]}
          </p>
          <p className="truncate text-[11px] text-slate-500">{currentUser.name}</p>
        </div>
        <ChevronDown className="size-3.5 shrink-0 text-slate-400" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Close role switcher"
          />
          <div className="absolute right-0 top-12 z-50 w-[330px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <UsersRound className="size-4 text-[#0f6f68]" />
                <p className="text-sm font-semibold text-slate-900">
                  Switch demo perspective
                </p>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Navigation and available actions change. Workflow state remains connected.
              </p>
            </div>
            <div className="max-h-[460px] overflow-y-auto p-2">
              {roles.map((roleId) => {
                const user = demoUsers[roleId];
                const active = role === roleId;
                return (
                  <button
                    type="button"
                    key={roleId}
                    onClick={() => chooseRole(roleId)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition",
                      active ? "bg-[#eaf5f2]" : "hover:bg-slate-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        active
                          ? "bg-[#0f6f68] text-white"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {user.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900">
                        {roleLabels[roleId]}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {user.name} · {user.organization}
                      </p>
                    </div>
                    {active ? <Check className="size-4 text-[#0f6f68]" /> : null}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-2">
              <button
                type="button"
                disabled={busyAction !== null}
                onClick={() => {
                  void resetDemo();
                  setOpen(false);
                  router.push("/applicant");
                }}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-50"
              >
                <RotateCcw className="size-3.5" />
                Reset connected demo workflow
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
