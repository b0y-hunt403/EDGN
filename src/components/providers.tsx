"use client";

import * as React from "react";
import { DemoProvider, useDemo } from "@/store/demo-store";
import { I18nProvider } from "@/lib/i18n-context";
import { dictionaries } from "@/i18n/dictionaries";

function I18nBridge({ children }: { children: React.ReactNode }) {
  const { language } = useDemo();
  const t = React.useCallback(
    (key: string) => dictionaries[language][key] ?? dictionaries.en[key] ?? key,
    [language]
  );
  return <I18nProvider value={{ lang: language, t }}>{children}</I18nProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <I18nBridge>{children}</I18nBridge>
    </DemoProvider>
  );
}

export { useDemo, I18nProvider };