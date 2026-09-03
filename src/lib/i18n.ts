import { dictionaries, translate } from "@/i18n/dictionaries";
import type { Language } from "@/types";

export { dictionaries, translate };

export type Dict = Record<Language, Record<string, string>>;

export const en = dictionaries.en;
export const am = dictionaries.am;