import type { DemoRoleId } from "@/types";

export const roleHome: Record<DemoRoleId, string> = {
  applicant: "/applicant",
  beneficiary: "/beneficiary",
  "bank-maker": "/bank/work-queue",
  "bank-checker": "/bank/approvals",
  "bank-signatory": "/bank/signatures",
  admin: "/admin",
  court: "/court",
  developer: "/developer",
};
