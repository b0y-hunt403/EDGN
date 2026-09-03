import type { DemoRoleId, DemoUser, PortalId } from "@/types";

interface RoleMeta {
  id: DemoRoleId;
  label: string;
  user: string;
  description: string;
  portal: PortalId;
}

export const roles: RoleMeta[] = [
  { id: "applicant", label: "Applicant", user: "Sara Mekonnen", description: "Requests and manages guarantees with banks.", portal: "applicant" },
  { id: "beneficiary", label: "Beneficiary", user: "Elias Hailu", description: "Receives, verifies and claims guarantees.", portal: "beneficiary" },
  { id: "bank-maker", label: "Bank Maker", user: "Tigist Alemu", description: "Reviews applications, checks documents, prepares records.", portal: "bank" },
  { id: "bank-checker", label: "Bank Checker", user: "Henok Getachew", description: "Independently approves prepared applications.", portal: "bank" },
  { id: "bank-signatory", label: "Bank Signatory", user: "Marta Kebede", description: "Authorizes issuance and digitally signs guarantees.", portal: "bank" },
  { id: "admin", label: "EDGN Administrator", user: "Liya Tadesse", description: "Configures and operates the platform.", portal: "admin" },
  { id: "court", label: "Court Officer", user: "Meron Bekele", description: "Manages authorized judicial cases.", portal: "court" },
  { id: "developer", label: "API Developer", user: "Biruk Hailu", description: "Integrates institutional systems via the API.", portal: "developer" },
];

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

export const roleLabels: Record<DemoRoleId, string> = {
  applicant: "Applicant",
  beneficiary: "Beneficiary",
  "bank-maker": "Bank Maker",
  "bank-checker": "Bank Checker",
  "bank-signatory": "Bank Signatory",
  admin: "EDGN Administrator",
  court: "Court Officer",
  developer: "API Developer",
};

export const demoUsers: Record<DemoRoleId, DemoUser> = {
  applicant: {
    id: "usr-app",
    name: "Sara Mekonnen",
    initials: initials("Sara Mekonnen"),
    title: "Authorized Representative",
    organization: "Meskel Construction PLC",
    email: "sara@meskelconstruction.et",
    location: "Addis Ababa",
    roleId: "applicant",
    portal: "applicant",
  },
  beneficiary: {
    id: "usr-ben",
    name: "Elias Hailu",
    initials: initials("Elias Hailu"),
    title: "Contracts Officer",
    organization: "Addis Ababa City Roads Authority",
    email: "elias@aacra.et",
    location: "Addis Ababa",
    roleId: "beneficiary",
    portal: "beneficiary",
  },
  "bank-maker": {
    id: "usr-maker",
    name: "Tigist Alemu",
    initials: initials("Tigist Alemu"),
    title: "Guarantee Operations Maker",
    organization: "Commercial Bank of Ethiopia",
    email: "tigist@cbe.com.et",
    location: "Addis Ababa",
    roleId: "bank-maker",
    portal: "bank",
  },
  "bank-checker": {
    id: "usr-checker",
    name: "Henok Getachew",
    initials: initials("Henok Getachew"),
    title: "Senior Credit Checker",
    organization: "Commercial Bank of Ethiopia",
    email: "henok@cbe.com.et",
    location: "Addis Ababa",
    roleId: "bank-checker",
    portal: "bank",
  },
  "bank-signatory": {
    id: "usr-sign",
    name: "Marta Kebede",
    initials: initials("Marta Kebede"),
    title: "Authorized Signatory",
    organization: "Commercial Bank of Ethiopia",
    email: "marta@cbe.com.et",
    location: "Addis Ababa",
    roleId: "bank-signatory",
    portal: "bank",
  },
  admin: {
    id: "usr-admin",
    name: "Liya Tadesse",
    initials: initials("Liya Tadesse"),
    title: "Platform Administrator",
    organization: "EDGN Authority",
    email: "liya@edgn.gov.et",
    location: "Addis Ababa",
    roleId: "admin",
    portal: "admin",
  },
  court: {
    id: "usr-court",
    name: "Meron Bekele",
    initials: initials("Meron Bekele"),
    title: "Authorized Judicial Officer",
    organization: "Federal First Instance Court",
    email: "meron@courts.gov.et",
    location: "Addis Ababa",
    roleId: "court",
    portal: "court",
  },
  developer: {
    id: "usr-dev",
    name: "Biruk Hailu",
    initials: initials("Biruk Hailu"),
    title: "Platform Engineer",
    organization: "TechPartner Integrations",
    email: "biruk@techpartner.et",
    location: "Addis Ababa",
    roleId: "developer",
    portal: "developer",
  },
};