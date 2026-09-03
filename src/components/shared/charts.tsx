import { cn } from "@/lib/utils";

export function BarChart({
  data,
  valueFormatter,
  className,
}: {
  data: { label: string; value: number; display?: string }[];
  valueFormatter?: (value: number) => string;
  className?: string;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className={cn("space-y-4", className)}>
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-4 text-xs">
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="font-medium text-slate-500">
              {item.display ?? valueFormatter?.(item.value) ?? item.value}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#173b53] transition-all duration-700"
              style={{ width: Math.max(5, (item.value / max) * 100) + "%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VerticalBars({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="flex h-56 items-end gap-3 pt-7">
      {data.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center">
          <div className="group relative flex h-44 w-full items-end">
            <div
              className="w-full min-w-3 rounded-t-md bg-[#0f6f68]/85 transition hover:bg-[#0f6f68]"
              style={{ height: Math.max(8, (item.value / max) * 100) + "%" }}
            >
              <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                {item.value.toLocaleString()}
              </span>
            </div>
          </div>
          <span className="mt-2 truncate text-[10px] font-medium text-slate-500 sm:text-xs">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number; color: string }[];
  centerLabel: string;
  centerValue: string;
}) {
  let cursor = 0;
  const stops = data
    .map((item) => {
      const start = cursor;
      cursor += item.value;
      return item.color + " " + start + "% " + cursor + "%";
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <div
        className="relative size-36 shrink-0 rounded-full"
        style={{ background: "conic-gradient(" + stops + ")" }}
      >
        <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-xl font-semibold text-slate-900">{centerValue}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            {centerLabel}
          </span>
        </div>
      </div>
      <div className="grid gap-2.5">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-xs">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="min-w-28 text-slate-600">{item.label}</span>
            <span className="font-semibold text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}