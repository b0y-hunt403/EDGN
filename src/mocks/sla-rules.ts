/*
 * MOCK SLA RULES — DEMO ONLY
 */

import type { SlaRule } from "@/types";

export const slaRules: SlaRule[] = [
  { id: "sla-001", bankId: "bk-cbe", name: "Maker submission", description: "Time to prepare and submit a complete guarantee request after draft is created.", stage: "Maker", targetHours: 8, escalationHours: 24, notifyRoles: ["Maker", "Bank Admin"], status: "Active" },
  { id: "sla-002", bankId: "bk-cbe", name: "Checker review", description: "Time to review and validate a submitted request before forwarding.", stage: "Checker", targetHours: 8, escalationHours: 24, notifyRoles: ["Checker", "Bank Admin"], status: "Active" },
  { id: "sla-003", bankId: "bk-cbe", name: "Checker correction", description: "Time to return a request to the Maker with requested corrections.", stage: "Checker", targetHours: 4, escalationHours: 12, notifyRoles: ["Checker"], status: "Active" },
  { id: "sla-004", bankId: "bk-cbe", name: "Approver decision", description: "Time to approve or reject a validated request.", stage: "Approver", targetHours: 8, escalationHours: 24, notifyRoles: ["Approver", "Bank Admin"], status: "Active" },
  { id: "sla-005", bankId: "bk-cbe", name: "Digital signature", description: "Time to complete the digital signature and activate the guarantee.", stage: "Signature", targetHours: 4, escalationHours: 12, notifyRoles: ["Approver"], status: "Active" },
  { id: "sla-006", bankId: "bk-cbe", name: "Claim response", description: "Time to respond to a submitted claim.", stage: "Claims", targetHours: 24, escalationHours: 48, notifyRoles: ["Bank Admin"], status: "Active" },
  { id: "sla-007", bankId: "bk-awash", name: "Maker submission", description: "Time to prepare and submit a complete guarantee request.", stage: "Maker", targetHours: 12, escalationHours: 36, notifyRoles: ["Maker", "Bank Admin"], status: "Active" },
];
