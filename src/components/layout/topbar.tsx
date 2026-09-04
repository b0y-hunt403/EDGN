"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, QrCode, LogOut } from "lucide-react";
import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { useDemo } from "@/store/demo-store";
import { useAuth } from "@/store/auth-store";
import { translate } from "@/i18n/dictionaries";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { currentUser, language, setLanguage } = useDemo();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="mr-2 flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>
      <GlobalSearch />
      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/verify"
          className="hidden h-10 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 lg:flex"
        >
          <QrCode className="size-4 text-[#0f6f68]" />
          Public verification
        </Link>
        <button
          type="button"
          onClick={() => setLanguage(language === "en" ? "am" : "en")}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-600 shadow-sm hover:border-slate-300"
          title={translate(language, "common.language")}
        >
          {language === "en" ? "አማ" : "EN"}
        </button>
        <NotificationPanel />
        <RoleSwitcher />
        <div className="ml-1 hidden items-center gap-2 border-l border-slate-200 pl-3 xl:flex">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#173b53] text-xs font-bold text-white">
            {currentUser.initials}
          </div>
          <div className="max-w-36">
            <p className="truncate text-xs font-semibold text-slate-900">
              {currentUser.name}
            </p>
            <p className="truncate text-[10px] text-slate-500">{currentUser.title}</p>
          </div>
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            title="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
