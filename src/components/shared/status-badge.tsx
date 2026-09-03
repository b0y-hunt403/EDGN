import { Badge } from "@/components/ui/badge";

type Variant = "success" | "warning" | "danger" | "info" | "neutral" | "indigo" | "default" | "outline";

const statusVariant: Record<string, Variant> = {
  ACTIVE: "success",
  ISSUED: "success",
  RELEASED: "neutral",
  CLOSED: "neutral",
  APPROVED: "success",
  COLLATERAL_RESERVED: "success",
  PAID: "success",
  PAYMENT_PENDING: "info",
  RESOLVED: "success",
  DRAFT: "outline",
  SUBMITTED: "info",
  UNDER_REVIEW: "info",
  MORE_INFORMATION_REQUIRED: "warning",
  PENDING_APPROVAL: "warning",
  PENDING_CHECKER: "warning",
  PENDING_SIGNATURE: "warning",
  COLLATERAL_PENDING: "warning",
  EXPIRING_SOON: "warning",
  CLAIM_PENDING: "danger",
  CLAIMED: "danger",
  DISPUTED: "danger",
  REJECTED: "danger",
  DECISION_ISSUED: "success",
  DECISION_DRAFT: "warning",
  INFORMATION_REQUESTED: "warning",
  COURT_REFERRED: "indigo",
  EVIDENCE_COLLECTION: "info",
  PARTY_RESPONSE: "warning",
  INTERNAL_REVIEW: "warning",
  "NEW_REFERRAL": "info",
  ACTIVE_CASE: "success",
  EXECUTION: "indigo",
  APPEAL: "warning",
  BLOCKED: "danger",
  VERIFIED: "success",
  Signed: "success",
  Pending: "warning",
  Superseded: "neutral",
};

export function StatusBadge({ status }: { status: string }) {
  const variant = statusVariant[status] ?? statusVariant[(status || "").toUpperCase()] ?? "default";
  const label = status?.replaceAll("_", " ") ?? status;
  return <Badge variant={variant}>{label}</Badge>;
}