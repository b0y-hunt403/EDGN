/*
 * MOCK BANK BRANCHES — DEMO ONLY
 */

import type { BankBranch } from "@/types";

export const bankBranches: BankBranch[] = [
  { id: "br-cbe-01", bankId: "bk-cbe", name: "Head Office Branch", code: "CBE-001", region: "Addis Ababa", city: "Addis Ababa", manager: "Dawit Assefa", phone: "+251 11 555 0101", status: "Active" },
  { id: "br-cbe-02", bankId: "bk-cbe", name: "Bole Branch", code: "CBE-002", region: "Addis Ababa", city: "Addis Ababa", manager: "Selam Tesfaye", phone: "+251 11 555 0102", status: "Active" },
  { id: "br-cbe-03", bankId: "bk-cbe", name: "Merkato Branch", code: "CBE-003", region: "Addis Ababa", city: "Addis Ababa", manager: "Yonas Girma", phone: "+251 11 555 0103", status: "Active" },
  { id: "br-cbe-04", bankId: "bk-cbe", name: "Bahir Dar Branch", code: "CBE-004", region: "Amhara", city: "Bahir Dar", manager: "Abel Worku", phone: "+251 58 555 0104", status: "Active" },
  { id: "br-cbe-05", bankId: "bk-cbe", name: "Hawassa Branch", code: "CBE-005", region: "SNNPR", city: "Hawassa", manager: "Meseret Tadesse", phone: "+251 46 555 0105", status: "Active" },
  { id: "br-cbe-06", bankId: "bk-cbe", name: "Mekelle Branch", code: "CBE-006", region: "Tigray", city: "Mekelle", manager: "Hailu Gebre", phone: "+251 34 555 0106", status: "Under review" },
  { id: "br-awash-01", bankId: "bk-awash", name: "Main Branch", code: "AWS-001", region: "Addis Ababa", city: "Addis Ababa", manager: "Rahel Mulugeta", phone: "+251 11 555 0201", status: "Active" },
  { id: "br-awash-02", bankId: "bk-awash", name: "Piazza Branch", code: "AWS-002", region: "Addis Ababa", city: "Addis Ababa", manager: "Biruk Ayele", phone: "+251 11 555 0202", status: "Active" },
  { id: "br-dashen-01", bankId: "bk-dashen", name: "Gonder Branch", code: "DSH-001", region: "Amhara", city: "Gonder", manager: "Kidist Mamo", phone: "+251 58 555 0301", status: "Active" },
  { id: "br-dashen-02", bankId: "bk-dashen", name: "Addis Ababa Branch", code: "DSH-002", region: "Addis Ababa", city: "Addis Ababa", manager: "Nahom Solomon", phone: "+251 11 555 0302", status: "Active" },
];
