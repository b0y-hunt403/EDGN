"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  onRowClick,
  empty,
  compact = false,
}: {
  rows: T[];
  columns: DataColumn<T>[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  compact?: boolean;
}) {
  if (rows.length === 0) {
    return <>{empty}</>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-y border-slate-200 bg-slate-50/90">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-[10px] font-bold uppercase tracking-[0.09em] text-slate-500",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
            {onRowClick ? <th className="w-12 px-3" aria-label="Open" /> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={cn(
                "group bg-white transition hover:bg-slate-50/80",
                onRowClick && "cursor-pointer",
              )}
              onClick={() => onRowClick?.(row)}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(event) => {
                if (onRowClick && (event.key === "Enter" || event.key === " ")) {
                  onRowClick(row);
                }
              }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    compact ? "px-4 py-3" : "px-4 py-3.5",
                    "text-sm text-slate-700",
                    column.className,
                  )}
                >
                  {column.render(row)}
                </td>
              ))}
              {onRowClick ? (
                <td className="px-3 text-right">
                  <ChevronRight className="ml-auto size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600" />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}