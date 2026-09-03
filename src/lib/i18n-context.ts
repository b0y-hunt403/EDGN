"use client";

import { createContext, useContext } from "react";

export type Lang = "en" | "am";

const i18nContext = createContext<{ lang: Lang; t: (key: string) => string }>({
  lang: "en",
  t: (key) => key,
});

export const I18nProvider = i18nContext.Provider;

export function useI18n() {
  return useContext(i18nContext);
}
