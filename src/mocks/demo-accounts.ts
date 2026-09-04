/*
 * MOCK AUTHENTICATION — DEMO ONLY
 *
 * Demo account credentials for presentation purposes.
 * These are frontend-only mock accounts.
 */

import type { DemoRoleId } from "@/types";

export interface DemoAccount {
  roleId: DemoRoleId;
  email: string;
  password: string;
  label: string;
  description: string;
}

export const DEMO_PASSWORD = "Demo@123";

export const demoAccounts: DemoAccount[] = [
  {
    roleId: "applicant",
    email: "demo.applicant@edgn.gov.et",
    password: DEMO_PASSWORD,
    label: "Applicant",
    description: "Meskel Construction PLC",
  },
  {
    roleId: "beneficiary",
    email: "demo.beneficiary@edgn.gov.et",
    password: DEMO_PASSWORD,
    label: "Beneficiary",
    description: "Addis Ababa City Roads Authority",
  },
  {
    roleId: "bank-maker",
    email: "demo.maker@bank.edgn.gov.et",
    password: DEMO_PASSWORD,
    label: "Bank Maker",
    description: "Commercial Bank of Ethiopia",
  },
  {
    roleId: "bank-checker",
    email: "demo.checker@bank.edgn.gov.et",
    password: DEMO_PASSWORD,
    label: "Bank Checker",
    description: "Commercial Bank of Ethiopia",
  },
  {
    roleId: "bank-signatory",
    email: "demo.signatory@bank.edgn.gov.et",
    password: DEMO_PASSWORD,
    label: "Bank Signatory",
    description: "Commercial Bank of Ethiopia",
  },
  {
    roleId: "admin",
    email: "demo.admin@edgn.gov.et",
    password: DEMO_PASSWORD,
    label: "EDGN Administrator",
    description: "EDGN Authority",
  },
  {
    roleId: "court",
    email: "demo.court@edgn.gov.et",
    password: DEMO_PASSWORD,
    label: "Court Officer",
    description: "Federal First Instance Court",
  },
  {
    roleId: "developer",
    email: "demo.developer@edgn.gov.et",
    password: DEMO_PASSWORD,
    label: "API Developer",
    description: "TechPartner Integrations",
  },
];

export function findDemoAccountByEmail(email: string): DemoAccount | undefined {
  return demoAccounts.find(
    (account) => account.email.toLowerCase() === email.toLowerCase(),
  );
}
