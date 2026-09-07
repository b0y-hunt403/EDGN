import type { DemoRoleId } from "@/types";

export const roleHome: Record<DemoRoleId, string> = {
  "super-admin": "/admin",
  "bank-admin": "/bank",
  "bank-maker": "/bank/my-guarantees",
  "bank-checker": "/bank/pending-reviews",
  "bank-approver": "/bank/pending-approvals",
  applicant: "/applicant",
  beneficiary: "/beneficiary",
};
