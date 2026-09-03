import type { Language } from "@/types";

export const dictionaries: Record<Language, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.guarantees": "Guarantees",
    "nav.notifications": "Notifications",
    "common.welcome": "Welcome",
    "common.language": "Language",
    "common.search": "Search",
    "common.demo": "Demo Environment",
  },
  am: {
    "nav.dashboard": "ዳሽቦርድ",
    "nav.guarantees": "ዋስትናዎች",
    "nav.notifications": "ማሳወቂያዎች",
    "common.welcome": "እንኳን ደህና መጡ",
    "common.language": "ቋንቋ",
    "common.search": "ፈልግ",
    "common.demo": "የማሳያ አካባቢ",
  },
};

export function translate(language: Language, key: string): string {
  return dictionaries[language][key] ?? dictionaries.en[key] ?? key;
}
