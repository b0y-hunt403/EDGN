import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchAndFilterBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  filters?: React.ReactNode;
  className?: string;
  count?: number;
}

export function SearchAndFilterBar({ value, onChange, placeholder = "Search…", filters, className, count }: SearchAndFilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", className)}>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-9 w-full rounded-md border border-brd bg-card pl-9 pr-3 text-sm text-foreground",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          )}
        />
      </div>
      {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
    </div>
  );
}

export function SelectFilter({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }>; label?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-brd bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
    >
      <option value="">{label ?? "All"}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
