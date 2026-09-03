"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (v: string) => void;
  tabs: Array<{ value: string; label: string }>;
  className?: string;
}

export function Tabs({ value, onValueChange, tabs, className }: TabsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1 border-b border-slate-200", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "relative px-3 py-2 text-sm font-medium transition-colors -mb-px border-b-2",
            value === tab.value
              ? "border-[#0f6f68] text-[#0f6f68]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
