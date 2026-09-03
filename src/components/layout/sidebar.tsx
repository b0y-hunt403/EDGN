"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, HelpCircle, X } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useDemo } from "@/store/demo-store";

export function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapsed,
}: {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();
  const { role } = useDemo();
  const sections = navigation[role];

  return (
    <>
      {open ? (
        <button
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-[#162f3d] text-slate-200 shadow-2xl transition-[width,transform] duration-200 lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[76px]" : "w-[268px] lg:w-[248px]",
        )}
      >
        <div
          className={cn(
            "flex h-[72px] shrink-0 items-center border-b border-white/8 px-5",
            collapsed ? "lg:justify-center lg:px-3" : "justify-between",
          )}
        >
          <Brand compact={collapsed} />
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="border-b border-white/8 px-4 py-3">
          <div
            className={cn(
              "rounded-lg border border-[#62d2bd]/15 bg-[#62d2bd]/6 px-3 py-2",
              collapsed && "lg:flex lg:justify-center lg:px-2",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#62d2bd]" />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.12em] text-[#9be1d3]",
                  collapsed && "lg:hidden",
                )}
              >
                Demo Environment
              </span>
            </div>
            <p
              className={cn(
                "mt-1 text-[10px] leading-4 text-slate-400",
                collapsed && "lg:hidden",
              )}
            >
              Mock data · no production actions
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section, sectionIndex) => (
            <div
              key={section.label ?? String(sectionIndex)}
              className={sectionIndex > 0 ? "mt-6" : ""}
            >
              {section.label ? (
                <p
                  className={cn(
                    "mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500",
                    collapsed && "lg:hidden",
                  )}
                >
                  {section.label}
                </p>
              ) : null}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      onClick={onClose}
                      className={cn(
                        "group flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition",
                        active
                          ? "bg-white/11 text-white shadow-[inset_3px_0_0_#62d2bd]"
                          : "text-slate-400 hover:bg-white/6 hover:text-slate-100",
                        collapsed && "lg:justify-center lg:px-2",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[17px] shrink-0",
                          active ? "text-[#62d2bd]" : "text-slate-500 group-hover:text-slate-300",
                        )}
                      />
                      <span className={cn("min-w-0 flex-1 truncate", collapsed && "lg:hidden")}>
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300",
                            collapsed && "lg:hidden",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/8 p-3">
          <Link
            href="/help"
            className={cn(
              "flex h-9 items-center gap-3 rounded-lg px-3 text-xs font-medium text-slate-400 hover:bg-white/6 hover:text-white",
              collapsed && "lg:justify-center lg:px-2",
            )}
          >
            <HelpCircle className="size-[17px]" />
            <span className={cn(collapsed && "lg:hidden")}>Help & guidance</span>
          </Link>
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={cn(
              "mt-1 hidden h-9 w-full items-center gap-3 rounded-lg px-3 text-xs font-medium text-slate-500 hover:bg-white/6 hover:text-slate-300 lg:flex",
              collapsed && "justify-center px-2",
            )}
          >
            <ChevronLeft
              className={cn("size-[17px] transition", collapsed && "rotate-180")}
            />
            <span className={cn(collapsed && "hidden")}>Collapse navigation</span>
          </button>
        </div>
      </aside>
    </>
  );
}
