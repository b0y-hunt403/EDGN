/*
 * MOCK BANK ROLE DEFINITIONS — DEMO ONLY
 */

import type { BankRole } from "@/types";

export const bankRoles: BankRole[] = [
  {
    id: "role-maker",
    name: "Maker",
    description: "Creates guarantee requests, prepares documents and submits for review. Cannot approve own work.",
    permissions: ["create", "read", "update", "submit"],
    userCount: 3,
  },
  {
    id: "role-checker",
    name: "Checker",
    description: "Independently reviews and validates submitted requests. Can request corrections or forward for approval.",
    permissions: ["read", "review", "validate", "return"],
    userCount: 2,
  },
  {
    id: "role-approver",
    name: "Approver",
    description: "Authorizes approved requests and initiates the digital signature workflow. Final bank approval authority.",
    permissions: ["read", "review", "approve", "reject", "sign"],
    userCount: 2,
  },
  {
    id: "role-admin",
    name: "Bank Admin",
    description: "Manages bank users, branches, approval matrices and SLA rules. Administrative configuration role.",
    permissions: ["create", "read", "update", "delete", "manage"],
    userCount: 1,
  },
];

export const bankRoleLabels: Record<string, string> = {
  maker: "Maker",
  checker: "Checker",
  approver: "Approver",
  admin: "Bank Admin",
};
