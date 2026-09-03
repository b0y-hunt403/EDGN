import type { LucideIcon } from "lucide-react";

export type DemoRoleId =
  | "applicant"
  | "beneficiary"
  | "bank-maker"
  | "bank-checker"
  | "bank-signatory"
  | "admin"
  | "court"
  | "developer";

export type PortalId =
  | "applicant"
  | "beneficiary"
  | "bank"
  | "admin"
  | "court"
  | "developer";

export type Language = "en" | "am";

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "MORE_INFORMATION_REQUIRED"
  | "PENDING_CHECKER"
  | "APPROVED"
  | "PENDING_SIGNATURE"
  | "ISSUED"
  | "REJECTED";

export type GuaranteeStatus =
  | "ACTIVE"
  | "EXPIRING_SOON"
  | "PENDING_APPROVAL"
  | "UNDER_REVIEW"
  | "CLAIM_PENDING"
  | "DISPUTED"
  | "RELEASED"
  | "EXPIRED";

export type ClaimStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PAYMENT_PENDING"
  | "PAID";

export type DisputeStatus =
  | "EVIDENCE_COLLECTION"
  | "PARTY_RESPONSE"
  | "INTERNAL_REVIEW"
  | "COURT_REFERRED"
  | "RESOLVED";

export interface DemoUser {
  id: string;
  name: string;
  initials: string;
  title: string;
  organization: string;
  email: string;
  location: string;
  roleId: DemoRoleId;
  portal: PortalId;
}

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  type: "Applicant" | "Beneficiary" | "Bank" | "Court" | "Government";
  tin: string;
  location: string;
  status: "Verified" | "Pending review" | "Active";
  representatives: number;
}

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  code: string;
  branches: number;
  integrationStatus: "Healthy" | "Degraded" | "Maintenance";
  responseTime: string;
  logoTone: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  actor: string;
  tone?: "success" | "warning" | "danger" | "neutral";
}

export interface DocumentRecord {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
  status: "Verified" | "Signed" | "Pending" | "Superseded";
  version?: string;
}

export interface GuaranteeVersion {
  version: number;
  kind: "Original" | "Extension" | "Amendment";
  effectiveDate: string;
  reason: string;
  signedBy: string;
  hash: string;
}

export interface Guarantee {
  id: string;
  reference: string;
  verificationReference: string;
  bankGuaranteeNumber: string;
  applicant: string;
  beneficiary: string;
  bank: string;
  branch: string;
  type: string;
  amount: number;
  currency: "ETB";
  issueDate: string;
  expiryDate: string;
  contractReference: string;
  contractTitle: string;
  status: GuaranteeStatus;
  version: number;
  publicVisibleAmount: boolean;
  documents: DocumentRecord[];
  versions: GuaranteeVersion[];
  timeline: TimelineEvent[];
}

export interface Application {
  id: string;
  reference: string;
  applicant: string;
  beneficiary: string;
  bank: string;
  bankId: string;
  type: string;
  amount: number;
  currency: "ETB";
  contractReference: string;
  contractTitle: string;
  tenderValue: number;
  effectiveDate: string;
  expiryDate: string;
  status: ApplicationStatus;
  priority: "Normal" | "High" | "Urgent";
  sla: string;
  assignee: string;
  submittedAt: string;
  kycStatus: "Verified" | "Review required";
  collateralStatus:
    | "Not started"
    | "Pending"
    | "Reserved"
    | "Not required";
  exposure: number;
  riskLevel: "Low" | "Moderate" | "Elevated";
  riskObservations: string[];
  documents: DocumentRecord[];
  timeline: TimelineEvent[];
}

export interface Claim {
  id: string;
  guaranteeReference: string;
  beneficiary: string;
  applicant: string;
  amount: number;
  currency: "ETB";
  reason: string;
  submittedDate: string;
  status: ClaimStatus;
  bank: string;
  dueDate: string;
}

export interface Dispute {
  id: string;
  caseNumber: string;
  guaranteeReference: string;
  type: string;
  subject: string;
  applicant: string;
  beneficiary: string;
  bank: string;
  status: DisputeStatus;
  openedDate: string;
  owner: string;
  evidenceCount: number;
  nextAction: string;
  timeline: TimelineEvent[];
}

export interface CourtEvidence {
  id: string;
  title: string;
  category: string;
  submittedBy: string;
  date: string;
  hash: string;
  integrity: "Verified";
  access: string;
}

export interface CourtCase {
  id: string;
  courtCaseNumber: string;
  edgnDisputeId: string;
  court: string;
  division: string;
  applicant: string;
  beneficiary: string;
  bank: string;
  guaranteeReference: string;
  claimReference: string;
  jurisdiction: string;
  referralDate: string;
  status:
    | "NEW_REFERRAL"
    | "ACTIVE"
    | "INFORMATION_REQUESTED"
    | "DECISION_DRAFT"
    | "DECISION_ISSUED"
    | "CLOSED";
  assignedOfficer: string;
  nextHearing: string;
  decisionStatus: string;
  appealStatus: string;
  executionStatus: string;
  evidence: CourtEvidence[];
  timeline: TimelineEvent[];
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  time: string;
  category: "workflow" | "security" | "expiry" | "integration";
  read: boolean;
  href: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  role: string;
  target: string;
  result: "Success" | "Denied" | "Warning";
  timestamp: string;
  ip: string;
  correlationId: string;
}

export interface IntegrationRecord {
  id: string;
  name: string;
  category: string;
  status: "Healthy" | "Degraded" | "Maintenance";
  availability: string;
  latency: string;
  lastEvent: string;
}

export interface ApiClient {
  id: string;
  name: string;
  organization: string;
  environment: "Sandbox" | "Production";
  status: "Active" | "Suspended";
  requests: string;
  lastUsed: string;
  scopes: string[];
}

export interface WebhookDelivery {
  id: string;
  event: string;
  endpoint: string;
  status: "Delivered" | "Retrying" | "Failed";
  responseCode: number;
  attempts: number;
  timestamp: string;
}

export type ManagementCell = string | number | boolean;

export interface ManagementDataset {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  columns: { key: string; label: string }[];
  rows: Array<Record<string, ManagementCell>>;
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export interface NewGuaranteeDraft {
  type: string;
  applicant: string;
  beneficiary: string;
  beneficiaryTin: string;
  beneficiaryContact: string;
  contractReference: string;
  contractTitle: string;
  tenderValue: string;
  amount: string;
  currency: "ETB";
  effectiveDate: string;
  expiryDate: string;
  purpose: string;
  bankId: string;
  branch: string;
  documents: string[];
  declaration: boolean;
}

export type ToastTone = "success" | "warning" | "danger" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}
