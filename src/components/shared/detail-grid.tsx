import type { ReactNode } from "react";

export function DetailGrid({
  items,
  columns = 2,
}: {
  items: { label: string; value: ReactNode }[];
  columns?: 2 | 3 | 4;
}) {
  const gridClass =
    columns === 4
      ? "md:grid-cols-2 xl:grid-cols-4"
      : columns === 3
        ? "md:grid-cols-2 xl:grid-cols-3"
        : "md:grid-cols-2";
  return (
    <dl className={"grid gap-x-8 gap-y-5 " + gridClass}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-[10px] font-bold uppercase tracking-[0.09em] text-slate-400">
            {item.label}
          </dt>
          <dd className="mt-1.5 text-sm font-semibold leading-5 text-slate-800">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}