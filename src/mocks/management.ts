import type { ManagementDataset } from "@/types";

export const adminDatasets: Record<string, ManagementDataset> = {
  organizations: {
    eyebrow: "Network directory",
    title: "Organizations",
    description:
      "Manage verified applicants, beneficiaries, government institutions, and ecosystem participants.",
    primaryAction: "Add organization",
    columns: [
      { key: "name", label: "Organization" },
      { key: "type", label: "Type" },
      { key: "location", label: "Location" },
      { key: "status", label: "Status" },
      { key: "users", label: "Users" },
    ],
    rows: [
      {
        name: "Meskel Construction PLC",
        type: "Applicant",
        location: "Addis Ababa",
        status: "Verified",
        users: 4,
      },
      {
        name: "Addis Ababa City Roads Authority",
        type: "Beneficiary",
        location: "Addis Ababa",
        status: "Verified",
        users: 12,
      },
      {
        name: "Ethiopian Electric Power",
        type: "Beneficiary",
        location: "Addis Ababa",
        status: "Active",
        users: 9,
      },
      {
        name: "Blue Nile Textiles PLC",
        type: "Applicant",
        location: "Hawassa",
        status: "Pending review",
        users: 2,
      },
    ],
  },
  users: {
    eyebrow: "Identity & access",
    title: "Users",
    description:
      "Review institutional users, role assignments, MFA state, and access lifecycle.",
    primaryAction: "Invite user",
    columns: [
      { key: "name", label: "User" },
      { key: "organization", label: "Organization" },
      { key: "role", label: "Role" },
      { key: "mfa", label: "MFA" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        name: "Sara Mekonnen",
        organization: "Meskel Construction PLC",
        role: "Applicant Manager",
        mfa: "Enabled",
        status: "Active",
      },
      {
        name: "Tigist Alemu",
        organization: "Commercial Bank of Ethiopia",
        role: "Bank Maker",
        mfa: "Enabled",
        status: "Active",
      },
      {
        name: "Meron Bekele",
        organization: "Federal First Instance Court",
        role: "Judicial Officer",
        mfa: "Enabled",
        status: "Active",
      },
      {
        name: "Mihret Worku",
        organization: "Highland Agro Exports PLC",
        role: "Applicant User",
        mfa: "Pending",
        status: "Invited",
      },
    ],
  },
  roles: {
    eyebrow: "Access governance",
    title: "Roles & permissions",
    description:
      "Maintain least-privilege role bundles and institution-specific assignments.",
    primaryAction: "Create role",
    columns: [
      { key: "role", label: "Role" },
      { key: "scope", label: "Scope" },
      { key: "permissions", label: "Permissions" },
      { key: "users", label: "Assigned users" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        role: "Bank Maker",
        scope: "Bank + branch",
        permissions: 18,
        users: 64,
        status: "Active",
      },
      {
        role: "Bank Checker",
        scope: "Bank + product",
        permissions: 14,
        users: 31,
        status: "Active",
      },
      {
        role: "Authorized Signatory",
        scope: "Bank + amount band",
        permissions: 9,
        users: 18,
        status: "Controlled",
      },
      {
        role: "Judicial Officer",
        scope: "Assigned cases",
        permissions: 12,
        users: 7,
        status: "Controlled",
      },
    ],
  },
  banks: {
    eyebrow: "Participating institutions",
    title: "Banks",
    description:
      "Manage participating banks, adapter capability, and operating status.",
    primaryAction: "Onboard bank",
    columns: [
      { key: "name", label: "Bank" },
      { key: "code", label: "Code" },
      { key: "branches", label: "Branches" },
      { key: "capabilities", label: "Capabilities" },
      { key: "status", label: "Integration" },
    ],
    rows: [
      {
        name: "Commercial Bank of Ethiopia",
        code: "CBE",
        branches: 1948,
        capabilities: "Full lifecycle",
        status: "Healthy",
      },
      {
        name: "Awash Bank",
        code: "AWB",
        branches: 947,
        capabilities: "Issue · verify · claims",
        status: "Healthy",
      },
      {
        name: "Dashen Bank",
        code: "DB",
        branches: 892,
        capabilities: "Full lifecycle",
        status: "Healthy",
      },
      {
        name: "Bank of Abyssinia",
        code: "BOA",
        branches: 861,
        capabilities: "Issue · verify",
        status: "Degraded",
      },
    ],
  },
  branches: {
    eyebrow: "Bank network",
    title: "Bank branches",
    description:
      "Review guarantee-enabled branches, routing rules, and operational ownership.",
    primaryAction: "Add branch",
    columns: [
      { key: "name", label: "Branch" },
      { key: "bank", label: "Bank" },
      { key: "city", label: "City" },
      { key: "queue", label: "Open tasks" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "Bole", bank: "CBE", city: "Addis Ababa", queue: 17, status: "Active" },
      { name: "Piassa", bank: "Awash", city: "Addis Ababa", queue: 9, status: "Active" },
      { name: "Hawassa", bank: "Dashen", city: "Hawassa", queue: 6, status: "Active" },
      { name: "Dukem", bank: "Coopbank", city: "Dukem", queue: 4, status: "Active" },
    ],
  },
  "guarantee-types": {
    eyebrow: "Product configuration",
    title: "Guarantee types",
    description:
      "Configure product behavior, required documents, and enabled lifecycle actions.",
    primaryAction: "Add guarantee type",
    columns: [
      { key: "name", label: "Type" },
      { key: "code", label: "Code" },
      { key: "templates", label: "Templates" },
      { key: "rules", label: "Rules" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "Performance Guarantee", code: "PERF", templates: 6, rules: 12, status: "Active" },
      { name: "Bid/Tender Guarantee", code: "BID", templates: 5, rules: 9, status: "Active" },
      { name: "Advance Payment Guarantee", code: "ADV", templates: 4, rules: 8, status: "Active" },
      { name: "Retention Guarantee", code: "RET", templates: 3, rules: 6, status: "Active" },
    ],
  },
  templates: {
    eyebrow: "Document configuration",
    title: "Guarantee templates",
    description:
      "Version and publish approved guarantee wording by bank, product, and language.",
    primaryAction: "New template",
    columns: [
      { key: "name", label: "Template" },
      { key: "bank", label: "Bank" },
      { key: "version", label: "Version" },
      { key: "language", label: "Language" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "CBE Performance Standard", bank: "CBE", version: "v4.2", language: "English", status: "Published" },
      { name: "CBE Bid Bond Standard", bank: "CBE", version: "v3.8", language: "English", status: "Published" },
      { name: "Awash Advance Payment", bank: "Awash", version: "v2.4", language: "English", status: "Published" },
      { name: "Performance Standard — Amharic", bank: "Network", version: "v1.1", language: "አማርኛ", status: "Review" },
    ],
  },
  rules: {
    eyebrow: "Decision support",
    title: "Guarantee rules",
    description:
      "Control calculated amounts, required fields, document rules, and authorized overrides.",
    primaryAction: "Create rule",
    columns: [
      { key: "name", label: "Rule" },
      { key: "product", label: "Product" },
      { key: "condition", label: "Condition" },
      { key: "effective", label: "Effective" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "Performance 10% Standard", product: "Performance", condition: "10% contract value", effective: "01 Jan 2026", status: "Active" },
      { name: "Bid Bond 2% Standard", product: "Bid/Tender", condition: "2% tender value", effective: "01 Jan 2026", status: "Active" },
      { name: "High-value dual approval", product: "All", condition: "Amount > ETB 10M", effective: "15 Mar 2026", status: "Active" },
      { name: "Minimum validity window", product: "All", condition: "At least 30 days", effective: "01 Jan 2026", status: "Active" },
    ],
  },
  approvals: {
    eyebrow: "Approval governance",
    title: "Approval matrices",
    description:
      "Define amount, product, branch, and risk-based maker-checker-signatory routing.",
    primaryAction: "Add matrix",
    columns: [
      { key: "name", label: "Matrix" },
      { key: "bank", label: "Bank" },
      { key: "range", label: "Amount range" },
      { key: "levels", label: "Levels" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "CBE Standard Guarantees", bank: "CBE", range: "Up to ETB 5M", levels: 2, status: "Active" },
      { name: "CBE High Value", bank: "CBE", range: "ETB 5M–25M", levels: 3, status: "Active" },
      { name: "Awash Standard", bank: "Awash", range: "Up to ETB 10M", levels: 2, status: "Active" },
      { name: "Network Court Instruction", bank: "All banks", range: "Any", levels: 2, status: "Controlled" },
    ],
  },
  sla: {
    eyebrow: "Service management",
    title: "SLA rules",
    description:
      "Configure timers, pause conditions, warning thresholds, and escalation ownership.",
    primaryAction: "Add SLA rule",
    columns: [
      { key: "name", label: "SLA" },
      { key: "workflow", label: "Workflow" },
      { key: "target", label: "Target" },
      { key: "warning", label: "Warning" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "Maker Review", workflow: "New guarantee", target: "8 business hours", warning: "2 hours", status: "Active" },
      { name: "Checker Approval", workflow: "Approval", target: "4 business hours", warning: "1 hour", status: "Active" },
      { name: "Claim Decision", workflow: "Claim", target: "3 business days", warning: "1 day", status: "Active" },
      { name: "Court Information Response", workflow: "Judicial", target: "Court due date", warning: "24 hours", status: "Controlled" },
    ],
  },
  notifications: {
    eyebrow: "Communication",
    title: "Notification templates",
    description:
      "Manage approved email, SMS, in-app, push, and webhook messages by event and language.",
    primaryAction: "New template",
    columns: [
      { key: "event", label: "Event" },
      { key: "channel", label: "Channel" },
      { key: "audience", label: "Audience" },
      { key: "language", label: "Language" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { event: "guarantee.issued", channel: "Email + in-app", audience: "Applicant · Beneficiary", language: "English", status: "Active" },
      { event: "guarantee.expiring", channel: "SMS + email", audience: "Applicant · Beneficiary", language: "English", status: "Active" },
      { event: "claim.created", channel: "Email + webhook", audience: "Bank · Applicant", language: "English", status: "Active" },
      { event: "court.information.requested", channel: "Email + in-app", audience: "Responsible party", language: "English", status: "Controlled" },
    ],
  },
  fraud: {
    eyebrow: "Risk monitoring",
    title: "Fraud alerts",
    description:
      "Triage explainable alerts for duplicate documents, suspicious QR activity, and abnormal workflows.",
    primaryAction: "Configure rules",
    columns: [
      { key: "reference", label: "Alert" },
      { key: "rule", label: "Rule" },
      { key: "severity", label: "Severity" },
      { key: "owner", label: "Owner" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { reference: "FRA-2026-00418", rule: "Modified signed document", severity: "High", owner: "Liya Alemayehu", status: "Investigating" },
      { reference: "FRA-2026-00417", rule: "Repeated failed verification", severity: "Medium", owner: "Risk Desk", status: "Open" },
      { reference: "FRA-2026-00411", rule: "Duplicate contract exposure", severity: "Medium", owner: "Bereket Tadesse", status: "Resolved" },
      { reference: "FRA-2026-00406", rule: "Unusual extension duration", severity: "Low", owner: "Risk Desk", status: "Monitoring" },
    ],
  },
  "api-clients": {
    eyebrow: "Ecosystem access",
    title: "API clients",
    description:
      "Manage institutional machine identities, scopes, limits, network restrictions, and rotation.",
    primaryAction: "Register client",
    columns: [
      { key: "name", label: "Client" },
      { key: "organization", label: "Organization" },
      { key: "environment", label: "Environment" },
      { key: "scopes", label: "Scopes" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "AACRA Procurement Sandbox", organization: "AACRA", environment: "Sandbox", scopes: 3, status: "Active" },
      { name: "EEP Contract Management", organization: "EEP", environment: "Production", scopes: 2, status: "Active" },
      { name: "MoTRI Integration Lab", organization: "MoTRI", environment: "Sandbox", scopes: 1, status: "Suspended" },
    ],
  },
  "feature-flags": {
    eyebrow: "Release controls",
    title: "Feature flags",
    description:
      "Control staged rollout by environment, institution, and approved capability.",
    primaryAction: "Create flag",
    columns: [
      { key: "key", label: "Flag" },
      { key: "scope", label: "Scope" },
      { key: "environment", label: "Environment" },
      { key: "updated", label: "Updated" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { key: "judicial_portal", scope: "Federal First Instance Court", environment: "Demo", updated: "31 Aug", status: "Enabled" },
      { key: "amharic_ui_preview", scope: "All demo users", environment: "Demo", updated: "29 Aug", status: "Enabled" },
      { key: "additional_guarantees", scope: "CBE · Dashen", environment: "Pilot", updated: "27 Aug", status: "Enabled" },
      { key: "automated_payment", scope: "None", environment: "Production", updated: "18 Aug", status: "Disabled" },
    ],
  },
};
