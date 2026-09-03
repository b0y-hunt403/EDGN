import type { ChartTimePoint } from "@/lib/types";

const now = Date.now();
const days = (n: number) => new Date(now + n * 86400000).toISOString();

export const platformHealth = {
  availability: 99.92,
  uptime: "99.92%",
  activeOrgs: 84,
  participatingBanks: 6,
  totalBanks: 7,
  activeGuarantees: 128,
  pendingExceptions: 5,
  apiLatencyP95: 412,
  apiLatencyP99: 890,
  verificationLatencyP95: 318,
};

export const integrationHealth = [
  { id: "bank-1", name: "Commercial Bank of Ethiopia", type: "Bank", status: "HEALTHY" as const, latency: 280, todayTx: 412 },
  { id: "bank-2", name: "Awash International Bank", type: "Bank", status: "HEALTHY" as const, latency: 340, todayTx: 388 },
  { id: "bank-3", name: "Dashen Bank", type: "Bank", status: "DEGRADED" as const, latency: 1240, todayTx: 156 },
  { id: "bank-4", name: "Bank of Abyssinia", type: "Bank", status: "HEALTHY" as const, latency: 305, todayTx: 244 },
  { id: "bank-6", name: "United Bank", type: "Bank", status: "HEALTHY" as const, latency: 260, todayTx: 321 },
  { id: "bank-7", name: "Nib International Bank", type: "Bank", status: "HEALTHY" as const, latency: 350, todayTx: 177 },
  { id: "kyc-1", name: "National ID (NID) Service", type: "KYC", status: "HEALTHY" as const, latency: 190, todayTx: 88 },
  { id: "sig-1", name: "Digital Signature Gateway", type: "Signature", status: "HEALTHY" as const, latency: 210, todayTx: 64 },
  { id: "sms-1", name: "SMS Gateway", type: "Notification", status: "HEALTHY" as const, latency: 120, todayTx: 512 },
  { id: "cr-1", name: "Federal First Instance Court Adapter", type: "Court", status: "HEALTHY" as const, latency: 420, todayTx: 12 },
];

export const webhookDeliveries = [
  { id: "w1", event: "guarantee.issued", client: "United Bank", url: "https://hooks.unitedbank.et/edgn", at: days(-0.2), status: "DELIVERED" as const, attempts: 1, latency: 210 },
  { id: "w2", event: "guarantee.approved", client: "CBE", url: "https://api.cbe.com.et/webhooks/edgn", at: days(-0.5), status: "DELIVERED" as const, attempts: 1, latency: 188 },
  { id: "w3", event: "claim.created", client: "Dashen", url: "https://webhooks.dashenbank.et/edgn", at: days(-1), status: "RETRYING" as const, attempts: 4, latency: 0 },
  { id: "w4", event: "court.decision.issued", client: "FCA", url: "https://fca.gov.et/edgn/decisions", at: days(-2), status: "DELIVERED" as const, attempts: 1, latency: 340 },
  { id: "w5", event: "guarantee.expired", client: "Awash", url: "https://api.awashbank.com/webhooks", at: days(-3), status: "FAILED" as const, attempts: 8, latency: 0 },
];

export const fraudAlerts = [
  { id: "f1", severity: "Critical" as const, rule: "Duplicate verification reference", entity: "EDGN-GAR-2026-0004555", detected: days(-0.5), status: "OPEN" as const, analyst: "Unassigned", disposition: "Pending review" },
  { id: "f2", severity: "High" as const, rule: "Rapid repeated QR checks > 10/min", entity: "EDGN-GAR-2026-0004588", detected: days(-1), status: "IN_REVIEW" as const, analyst: "Hirut Bekele", disposition: "Investigating" },
  { id: "f3", severity: "Medium" as const, rule: "Unusual beneficiary location", entity: "EDGN-GAR-2026-0004410", detected: days(-2), status: "DISMISSED" as const, analyst: "Hirut Bekele", disposition: "False positive" },
];

export const apiClients = [
  { id: "c1", name: "CBE Core Integration", organization: "Commercial Bank of Ethiopia", scopes: 9, env: "Production" as const, rateLimit: 1200, status: "ACTIVE" as const, lastUsed: days(-0.1), keyExpiry: days(90) },
  { id: "c2", name: "Awash Guarantee Adapter", organization: "Awash International Bank", scopes: 7, env: "Production" as const, rateLimit: 800, status: "ACTIVE" as const, lastUsed: days(-0.3), keyExpiry: days(45) },
  { id: "c3", name: "FCA Evidence Service", organization: "Federal First Instance Court", scopes: 5, env: "Production" as const, rateLimit: 300, status: "ACTIVE" as const, lastUsed: days(-1), keyExpiry: days(120) },
  { id: "c4", name: "Sandbox – TechPartner", organization: "TechPartner Integrations", scopes: 11, env: "Sandbox" as const, rateLimit: 500, status: "ACTIVE" as const, lastUsed: days(-2), keyExpiry: days(30) },
  { id: "c5", name: "Legacy – Old API Key", organization: "Commercial Bank of Ethiopia", scopes: 4, env: "Production" as const, rateLimit: 200, status: "REVOKED" as const, lastUsed: days(-90), keyExpiry: days(-60) },
];

export const usageTrend: ChartTimePoint[] = [
  { label: "Apr", value: 1800 },
  { label: "May", value: 2600 },
  { label: "Jun", value: 3100 },
  { label: "Jul", value: 2900 },
  { label: "Aug", value: 3800 },
  { label: "Sep", value: 4300 },
];

export const guaranteeTypes = [
  { id: "gt1", code: "BD", name: "Bid / Tender", status: "ACTIVE" as const, banks: 6, templates: 4, updated: days(-5) },
  { id: "gt2", code: "PF", name: "Performance", status: "ACTIVE" as const, banks: 6, templates: 7, updated: days(-3) },
  { id: "gt3", code: "AP", name: "Advance Payment", status: "ACTIVE" as const, banks: 6, templates: 6, updated: days(-2) },
  { id: "gt4", code: "RT", name: "Retention", status: "ACTIVE" as const, banks: 6, templates: 3, updated: days(-9) },
  { id: "gt5", code: "PM", name: "Payment", status: "ACTIVE" as const, banks: 5, templates: 4, updated: days(-12) },
  { id: "gt6", code: "CS", name: "Customs", status: "ACTIVE" as const, banks: 5, templates: 2, updated: days(-15) },
  { id: "gt7", code: "CN", name: "Contract", status: "DRAFT" as const, banks: 0, templates: 1, updated: days(-1) },
];

export const apiEndpoints: Array<{ method: string; path: string; auth: string; note: string }> = [
  { method: "POST", path: "/api/v1/guarantee-applications", auth: "Bearer", note: "Create a guarantee application" },
  { method: "POST", path: "/api/v1/guarantee-applications/{id}/submit", auth: "Bearer", note: "Submit an application" },
  { method: "GET", path: "/api/v1/guarantees", auth: "Bearer", note: "List guarantees (scoped)" },
  { method: "GET", path: "/api/v1/guarantees/{id}/versions", auth: "Bearer", note: "List guarantee versions" },
  { method: "GET", path: "/api/v1/verify/{verificationReference}", auth: "Public", note: "Public authenticity verification" },
  { method: "POST", path: "/api/v1/disputes", auth: "Bearer", note: "Open a dispute" },
  { method: "POST", path: "/api/v1/guarantees/{id}/claims", auth: "Bearer", note: "Submit a claim" },
  { method: "GET", path: "/api/v1/audit-logs", auth: "Bearer + scope", note: "Query audit logs (privileged)" },
];

export const webhookEvents = [
  { id: "e1", event: "guarantee.created", description: "A new guarantee application was created" },
  { id: "e2", event: "guarantee.submitted", description: "An application was submitted to a bank" },
  { id: "e3", event: "guarantee.approved", description: "A guarantee was approved" },
  { id: "e4", event: "guarantee.issued", description: "A guarantee was issued and signed" },
  { id: "e5", event: "guarantee.amended", description: "A guarantee was amended to a new version" },
  { id: "e6", event: "guarantee.extended", description: "A guarantee was extended to a new version" },
  { id: "e7", event: "guarantee.expired", description: "A guarantee reached its expiry date" },
  { id: "e8", event: "claim.created", description: "A beneficiary submitted a claim" },
  { id: "e9", event: "claim.approved", description: "A claim was approved" },
  { id: "e10", event: "dispute.created", description: "A dispute was opened" },
  { id: "e11", event: "court.decision.issued", description: "A judicial decision was received" },
];
