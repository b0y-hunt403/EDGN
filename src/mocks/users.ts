import type { DemoRoleId, DemoUser, PortalId } from "@/types";

interface RoleMeta {
  id: DemoRoleId;
  label: string;
  user: string;
  description: string;
  portal: PortalId;
}

export const roles: RoleMeta[] = [
  { id: "super-admin", label: "Super Admin", user: "Liya Tadesse", description: "Platform-level EDGN administrator.", portal: "admin" },
  { id: "bank-admin", label: "Bank Admin", user: "Tigist Alemu", description: "Manages bank users, branches and configuration.", portal: "bank" },
  { id: "bank-maker", label: "Bank Maker", user: "Daniel Berhanu", description: "Creates and submits guarantee requests.", portal: "bank" },
  { id: "bank-checker", label: "Bank Checker", user: "Henok Getachew", description: "Reviews and validates guarantee requests.", portal: "bank" },
  { id: "bank-approver", label: "Bank Approver", user: "Marta Kebede", description: "Approves requests and authorizes issuance.", portal: "bank" },
  { id: "applicant", label: "Applicant", user: "Sara Mekonnen", description: "Requests and manages guarantees with banks.", portal: "applicant" },
  { id: "beneficiary", label: "Beneficiary", user: "Elias Hailu", description: "Receives, verifies and claims guarantees.", portal: "beneficiary" },
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
  "super-admin": "Super Admin",
  "bank-admin": "Bank Admin",
  "bank-maker": "Bank Maker",
  "bank-checker": "Bank Checker",
  "bank-approver": "Bank Approver",
  applicant: "Applicant",
  beneficiary: "Beneficiary",
};

export const demoUsers: Record<DemoRoleId, DemoUser> = {
  "super-admin": {
    id: "usr-super",
    name: "Liya Tadesse",
    initials: initials("Liya Tadesse"),
    title: "Platform Administrator",
    organization: "EDGN Authority",
    email: "liya@edgn.gov.et",
    location: "Addis Ababa",
    roleId: "super-admin",
    portal: "admin",
  },
  "bank-admin": {
    id: "usr-bankadmin",
    name: "Tigist Alemu",
    initials: initials("Tigist Alemu"),
    title: "Bank Administrator",
    organization: "Commercial Bank of Ethiopia",
    email: "tigist@cbe.com.et",
    location: "Addis Ababa",
    roleId: "bank-admin",
    portal: "bank",
  },
  "bank-maker": {
    id: "usr-maker",
    name: "Daniel Berhanu",
    initials: initials("Daniel Berhanu"),
    title: "Guarantee Operations Maker",
    organization: "Commercial Bank of Ethiopia",
    email: "daniel@cbe.com.et",
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
  "bank-approver": {
    id: "usr-approver",
    name: "Marta Kebede",
    initials: initials("Marta Kebede"),
    title: "Authorized Approver",
    organization: "Commercial Bank of Ethiopia",
    email: "marta@cbe.com.et",
    location: "Addis Ababa",
    roleId: "bank-approver",
    portal: "bank",
  },
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
};
