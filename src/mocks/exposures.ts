/*
 * MOCK EXPOSURE / LIMIT PROFILES — DEMO ONLY
 *
 * SRS 31 — Per-customer exposure tracking. Facility limit vs. existing
 * guarantees, available limit, and block/escalation thresholds.
 */

import type { ExposureProfile } from "@/types";

export const exposureProfiles: ExposureProfile[] = [
  {
    id: "exp-001",
    bankId: "bk-cbe",
    customer: "Meskel Construction PLC",
    customerTin: "0012847395",
    facilityLimit: 50000000,
    currency: "ETB",
    utilizationRatio: 0.62,
    status: "Normal",
    updated: "06 Sep 2026",
  },
  {
    id: "exp-002",
    bankId: "bk-cbe",
    customer: "Ethio Steel Works PLC",
    customerTin: "0009845127",
    facilityLimit: 35000000,
    currency: "ETB",
    utilizationRatio: 0.78,
    status: "Warning",
    updated: "05 Sep 2026",
  },
  {
    id: "exp-003",
    bankId: "bk-cbe",
    customer: "Highland Agro Exports PLC",
    customerTin: "0021047390",
    facilityLimit: 15000000,
    currency: "ETB",
    utilizationRatio: 0.46,
    status: "Normal",
    updated: "04 Sep 2026",
  },
  {
    id: "exp-004",
    bankId: "bk-cbe",
    customer: "Danat Trading Share Company",
    customerTin: "0017712468",
    facilityLimit: 60000000,
    currency: "ETB",
    utilizationRatio: 0.94,
    status: "Blocked",
    updated: "06 Sep 2026",
  },
  {
    id: "exp-005",
    bankId: "bk-cbe",
    customer: "Blue Nile Textiles PLC",
    customerTin: "0030092145",
    facilityLimit: 20000000,
    currency: "ETB",
    utilizationRatio: 0.12,
    status: "Normal",
    updated: "02 Sep 2026",
  },
  {
    id: "exp-006",
    bankId: "bk-awash",
    customer: "Highland Agro Exports PLC",
    customerTin: "0021047390",
    facilityLimit: 18000000,
    currency: "ETB",
    utilizationRatio: 0.72,
    status: "Warning",
    updated: "05 Sep 2026",
  },
];