export type DemoRole =
  | "applicant"
  | "beneficiary"
  | "maker"
  | "checker"
  | "signatory"
  | "admin"
  | "court"
  | "developer";

export type GuaranteeStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "MORE_INFORMATION_REQUIRED"
  | "APPROVED"
  | "COLLATERAL_PENDING"
  | "COLLATERAL_RESERVED"
  | "ISSUED"
  | "ACTIVE"
  | "AMENDMENT_PENDING"
  | "AMENDED"
  | "EXTENSION_PENDING"
  | "EXTENDED"
  | "CLAIM_PENDING"
  | "CLAIMED"
  | "CLAIM_REJECTED"
  | "CLAIM_PAID"
  | "RELEASE_REQUESTED"
  | "RELEASED"
  | "EXPIRED"
  | "CANCELLED"
  | "DISPUTED"
  | "CLOSED";

export type GuaranteeType =
  | "Bid / Tender"
  | "Performance"
  | "Advance Payment"
  | "Retention"
  | "Payment"
  | "Customs"
  | "Contract";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Money {
  amount: number;
  currency: "ETB";
}

export interface Organization {
  id: string;
  name: string;
  tradingName?: string;
  type: string;
  tin: string;
  license: string;
  sector: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  verified: boolean;
}

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  tin: string;
  status: "ACTIVE" | "ONBOARDING" | "SUSPENDED";
  branches: number;
  adapters: string[];
  connectionHealth: "HEALTHY" | "DEGRADED" | "DOWN";
  joined: string;
}

export interface BankBranch {
  id: string;
  bankId: string;
  name: string;
  city: string;
  code: string;
  region: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface Guarantee {
  id: string;
  reference: string;
  type: GuaranteeType;
  applicantId: string;
  applicant: string;
  beneficiary: string;
  beneficiaryId?: string;
  bankId: string;
  bank: string;
  bankBranch: string;
  contractRef: string;
  contractTitle: string;
  contractValue: Money;
  amount: Money;
  purpose: string;
  effectiveDate: string;
  expiryDate: string;
  requestedExpiry?: string;
  status: GuaranteeStatus;
  version: number;
  issuedAt?: string;
  verified: boolean;
  qrRef: string;
  collateral: {
    required: boolean;
    type?: string;
    amount?: Money;
    status: "NOT_REQUIRED" | "PENDING" | "RESERVED" | "RELEASED" | "BLOCKED";
  };
  timeline: TimelineEvent[];
  previousStatus?: GuaranteeStatus;
  related?: string[];
}

export interface TimelineEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
  type: "created" | "submitted" | "review" | "approval" | "collateral" | "issued" | "claim" | "release" | "dispute" | "info" | "system";
}

export interface GuaranteeApplication {
  id: string;
  reference: string;
  type: GuaranteeType;
  applicant: string;
  applicantId: string;
  beneficiary: string;
  contractRef: string;
  contractTitle: string;
  contractValue: Money;
  amount: Money;
  effectiveDate: string;
  expiryDate: string;
  bank: string;
  bankId: string;
  branch: string;
  status: GuaranteeStatus;
  stage: "FORM_DRAFT" | "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "MORE_INFORMATION_REQUIRED" | "APPROVED" | "COLLATERAL_PENDING" | "COLLATERAL_RESERVED" | "ISSUED" | "REJECTED" | "CANCELLED";
  submittedAt?: string;
  updatedAt: string;
  assignedTo?: string;
  slaDue?: string;
  checklist: Array<{ id: string; name: string; provided: boolean; verified?: boolean }>;
  documents: Array<{ id: string; name: string; category: string; size: string; uploadedAt: string }>;
  maker?: string;
  notes?: string;
}

export interface Claim {
  id: string;
  reference: string;
  guaranteeId: string;
  guaranteeRef: string;
  guaranteeType: GuaranteeType;
  applicant: string;
  beneficiary: string;
  bank: string;
  claimAmount: Money;
  availableAmount: Money;
  reason: string;
  submittedBy: string;
  submittedAt: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "MORE_INFO" | "APPROVED" | "REJECTED" | "PAID" | "DISPUTED" | "CLOSED";
  documents: string[];
  decision?: string;
  decisionBy?: string;
  decisionAt?: string;
  settlement?: { amount: Money; reference: string; paidAt: string; status: string };
}

export interface Dispute {
  id: string;
  reference: string;
  type: string;
  guaranteeId: string;
  guaranteeRef: string;
  guaranteeType: GuaranteeType;
  applicant: string;
  beneficiary: string;
  bank: string;
  subject: string;
  description: string;
  openedBy: string;
  openedAt: string;
  status: "OPEN" | "EVIDENCE_COLLECTION" | "PARTIES_NOTIFIED" | "RESPONSES_PENDING" | "INTERNAL_REVIEW" | "NEGOTIATION" | "ESCALATED" | "RESOLVED" | "COURT_REFFERED" | "CLOSED";
  priority: Priority;
  parties: Array<{ name: string; role: string }>;
  evidenceCount: number;
  messageCount: number;
  dueDate: string;
}

export interface CourtCase {
  id: string;
  reference: string;
  caseNumber: string;
  disputeRef: string;
  guaranteeRef: string;
  guaranteeType: GuaranteeType;
  applicant: string;
  beneficiary: string;
  bank: string;
  jurisdiction: string;
  division: string;
  assignedClerk: string;
  assignedOficer: string;
  status: "REFERRED" | "INTAKE" | "ACCEPTED" | "PENDING_INFO" | "HEARINGS" | "DECISION_PENDING" | "DECISION_ISSUED" | "BANK_INSTRUCTIONS" | "EXECUTION" | "APPEAL" | "CLOSED";
  filedAt: string;
  nextHearing?: string;
  decisionStatus?: string;
  priority: Priority;
  evidenceCount: number;
}

export interface Notification {
  id: string;
  subject: string;
  body: string;
  at: string;
  channel: string;
  read: boolean;
  category: "guarantee" | "claim" | "dispute" | "system" | "expiry" | "task";
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  role: string;
  action: string;
  objectType: string;
  objectRef: string;
  ip: string;
  session: string;
  result: "SUCCESS" | "FAILED" | "BLOCKED";
  detail: string;
}

export interface DashboardData {
  activeGuarantees: number;
  pendingTasks: number;
  drafts: number;
  expiringSoon: number;
  openClaims: number;
  openDisputes: number;
  totalValue: Money;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  organization: string;
  title: string;
}

export interface ChartTimePoint {
  label: string;
  value: number;
}

export interface RoleDescriptor {
  key: DemoRole;
  label: string;
  user: string;
  description: string;
}
