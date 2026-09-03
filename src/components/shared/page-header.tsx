import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: string[];
}) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500">
          {breadcrumbs.map((item, index) => (
            <span key={item} className="flex items-center gap-1.5">
              {index > 0 ? <ChevronRight className="size-3" /> : null}
              <span className={index === breadcrumbs.length - 1 ? "text-slate-700" : ""}>
                {item}
              </span>
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f6f68]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-[28px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}