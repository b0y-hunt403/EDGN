"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input, Select } from "@/components/ui/form-controls";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  ariaLabel: string;
}

export function SearchAndFilterBar({
  query,
  onQueryChange,
  placeholder = "Search by reference, organization, or type",
  filters = [],
  trailing,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder?: string;
  filters?: FilterConfig[];
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filters.length > 0 ? (
          <SlidersHorizontal className="mr-1 hidden size-4 text-slate-400 sm:block" />
        ) : null}
        {filters.map((filter) => (
          <Select
            key={filter.ariaLabel}
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
            aria-label={filter.ariaLabel}
            className="w-auto min-w-36"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ))}
        {trailing}
      </div>
    </div>
  );
}
