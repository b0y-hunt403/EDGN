import {
  Activity,
  AlertTriangle,
  Archive,
  BadgeCheck,
  Banknote,
  Bell,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  CheckCheck,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Code2,
  FileCheck2,
  FileClock,
  FileKey2,
  FileSearch,
  FileText,
  Fingerprint,
  Flag,
  Gauge,
  Gavel,
  GitBranch,
  History,
  House,
  KeyRound,
  Landmark,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Network,
  NotebookTabs,
  PackageCheck,
  PlugZap,
  QrCode,
  ReceiptText,
  Scale,
  ScrollText,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  SquareCode,
  Stamp,
  UserRoundCog,
  Users,
  Webhook,
  Workflow,
} from "lucide-react";
import type { DemoRoleId, NavSection } from "@/types";

export const navigation: Record<DemoRoleId, NavSection[]> = {
  applicant: [
    {
      label: "Workspace",
      items: [
        { label: "Dashboard", href: "/applicant", icon: LayoutDashboard },
        {
          label: "New guarantee",
          href: "/applicant/applications/new",
          icon: FileCheck2,
        },
        {
          label: "Guarantees",
          href: "/applicant/guarantees",
          icon: ShieldCheck,
        },
        {
          label: "Documents",
          href: "/applicant/documents",
          icon: Archive,
        },
      ],
    },
    {
      label: "Lifecycle",
      items: [
        { label: "Requests", href: "/applicant/requests", icon: GitBranch },
        { label: "Claims", href: "/applicant/claims", icon: ReceiptText },
        {
          label: "Disputes",
          href: "/applicant/disputes",
          icon: MessagesSquare,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          label: "Notifications",
          href: "/applicant/notifications",
          icon: Bell,
          badge: "3",
        },
        { label: "Profile", href: "/applicant/profile", icon: Building2 },
        { label: "Security", href: "/applicant/security", icon: Fingerprint },
      ],
    },
  ],
  beneficiary: [
    {
      label: "Workspace",
      items: [
        { label: "Dashboard", href: "/beneficiary", icon: LayoutDashboard },
        {
          label: "Received guarantees",
          href: "/beneficiary/guarantees",
          icon: ShieldCheck,
        },
        {
          label: "Verify guarantee",
          href: "/beneficiary/verification",
          icon: QrCode,
        },
        {
          label: "Expiring",
          href: "/beneficiary/expiring",
          icon: FileClock,
          badge: "4",
        },
      ],
    },
    {
      label: "Actions",
      items: [
        {
          label: "Extension requests",
          href: "/beneficiary/extensions",
          icon: Clock3,
        },
        { label: "Claims", href: "/beneficiary/claims", icon: ReceiptText },
        { label: "Release requests", href: "/beneficiary/releases", icon: CheckCheck },
        { label: "Disputes", href: "/beneficiary/disputes", icon: MessagesSquare },
        { label: "Evidence", href: "/beneficiary/evidence", icon: FileKey2 },
      ],
    },
    {
      label: "Account",
      items: [
        {
          label: "Notifications",
          href: "/beneficiary/notifications",
          icon: Bell,
          badge: "3",
        },
        { label: "Profile", href: "/beneficiary/profile", icon: Building2 },
      ],
    },
  ],
  "bank-maker": [
    {
      label: "Operations",
      items: [
        { label: "Dashboard", href: "/bank", icon: LayoutDashboard },
        {
          label: "Work queue",
          href: "/bank/work-queue",
          icon: ListChecks,
          badge: "17",
        },
        { label: "Registry", href: "/bank/registry", icon: Archive },
        { label: "Collateral", href: "/bank/collateral", icon: CircleDollarSign },
      ],
    },
    {
      label: "Lifecycle",
      items: [
        { label: "Claims", href: "/bank/claims", icon: ReceiptText },
        { label: "Disputes", href: "/bank/disputes", icon: MessagesSquare },
        { label: "Court instructions", href: "/bank/instructions", icon: Gavel },
      ],
    },
    {
      label: "Oversight",
      items: [
        { label: "Operational alerts", href: "/bank/alerts", icon: AlertTriangle },
        { label: "Reports", href: "/bank/reports", icon: ChartNoAxesCombined },
      ],
    },
  ],
  "bank-checker": [
    {
      label: "Approval desk",
      items: [
        { label: "Dashboard", href: "/bank", icon: LayoutDashboard },
        {
          label: "Approval queue",
          href: "/bank/approvals",
          icon: ClipboardCheck,
          badge: "8",
        },
        { label: "Registry", href: "/bank/registry", icon: Archive },
        { label: "Exposure", href: "/bank/exposure", icon: ChartNoAxesCombined },
      ],
    },
    {
      label: "Decisions",
      items: [
        { label: "Claims", href: "/bank/claims", icon: ReceiptText },
        { label: "Disputes", href: "/bank/disputes", icon: MessagesSquare },
        { label: "Reports", href: "/bank/reports", icon: FileText },
      ],
    },
  ],
  "bank-signatory": [
    {
      label: "Authorization",
      items: [
        { label: "Dashboard", href: "/bank", icon: LayoutDashboard },
        {
          label: "Signature queue",
          href: "/bank/signatures",
          icon: Stamp,
          badge: "5",
        },
        { label: "Issued guarantees", href: "/bank/registry", icon: BadgeCheck },
        { label: "Approval history", href: "/bank/history", icon: History },
      ],
    },
    {
      label: "Authority",
      items: [
        { label: "Claims", href: "/bank/claims", icon: ReceiptText },
        { label: "Court instructions", href: "/bank/instructions", icon: Gavel },
        { label: "Reports", href: "/bank/reports", icon: ChartNoAxesCombined },
      ],
    },
  ],
  admin: [
    {
      label: "Platform",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Organizations", href: "/admin/organizations", icon: Building2 },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Roles & permissions", href: "/admin/roles", icon: UserRoundCog },
        { label: "Banks", href: "/admin/banks", icon: Landmark },
        { label: "Bank branches", href: "/admin/branches", icon: Network },
      ],
    },
    {
      label: "Configuration",
      items: [
        {
          label: "Guarantee types",
          href: "/admin/guarantee-types",
          icon: Boxes,
        },
        { label: "Templates", href: "/admin/templates", icon: NotebookTabs },
        { label: "Rules", href: "/admin/rules", icon: Workflow },
        { label: "Approval matrices", href: "/admin/approvals", icon: GitBranch },
        { label: "SLA rules", href: "/admin/sla", icon: Clock3 },
        {
          label: "Notification templates",
          href: "/admin/notifications",
          icon: Bell,
        },
      ],
    },
    {
      label: "Operations & risk",
      items: [
        { label: "Fraud alerts", href: "/admin/fraud", icon: ShieldAlert },
        { label: "Integrations", href: "/admin/integrations", icon: PlugZap },
        { label: "Webhook deliveries", href: "/admin/webhooks", icon: Webhook },
        { label: "API clients", href: "/admin/api-clients", icon: KeyRound },
        { label: "Feature flags", href: "/admin/feature-flags", icon: Flag },
        { label: "Audit logs", href: "/admin/audit", icon: ScrollText },
        { label: "Reports", href: "/admin/reports", icon: ChartNoAxesCombined },
      ],
    },
  ],
  court: [
    {
      label: "Judicial workspace",
      items: [
        { label: "Dashboard", href: "/court", icon: Scale },
        {
          label: "Case queue",
          href: "/court/cases",
          icon: BriefcaseBusiness,
          badge: "6",
        },
        { label: "Evidence review", href: "/court/evidence", icon: FileSearch },
        {
          label: "Information requests",
          href: "/court/information-requests",
          icon: MessagesSquare,
        },
        { label: "Hearings", href: "/court/hearings", icon: Clock3 },
      ],
    },
    {
      label: "Judicial records",
      items: [
        { label: "Orders & decisions", href: "/court/decisions", icon: Gavel },
        { label: "Appeals", href: "/court/appeals", icon: GitBranch },
        { label: "Bank instructions", href: "/court/instructions", icon: Banknote },
        { label: "Execution tracking", href: "/court/execution", icon: PackageCheck },
        { label: "Closed cases", href: "/court/closed", icon: Archive },
      ],
    },
  ],
  developer: [
    {
      label: "Developer portal",
      items: [
        { label: "Overview", href: "/developer", icon: House },
        { label: "API clients", href: "/developer/clients", icon: KeyRound },
        { label: "Sandbox", href: "/developer/sandbox", icon: SquareCode },
        { label: "Usage & limits", href: "/developer/usage", icon: Gauge },
        { label: "Webhooks", href: "/developer/webhooks", icon: Webhook },
      ],
    },
    {
      label: "Build",
      items: [
        { label: "API documentation", href: "/developer/docs", icon: BookOpen },
        { label: "Endpoint explorer", href: "/developer/explorer", icon: Code2 },
        { label: "Authentication", href: "/developer/authentication", icon: KeyRound },
        { label: "Changelog", href: "/developer/changelog", icon: Activity },
      ],
    },
  ],
};
