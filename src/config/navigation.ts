import {
  Archive,
  BadgeCheck,
  Bell,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileClock,
  FileSignature,
  FileSearch,
  Fingerprint,
  GitBranch,
  Landmark,
  LayoutDashboard,
  MessagesSquare,
  Network,
  PlugZap,
  ReceiptText,
  ScrollText,
  ShieldCheck,
  UserRoundCog,
  Users,
  Webhook,
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
          label: "My Guarantees",
          href: "/beneficiary/guarantees",
          icon: ShieldCheck,
        },
        {
          label: "Claims",
          href: "/beneficiary/claims",
          icon: ReceiptText,
        },
        {
          label: "Documents",
          href: "/beneficiary/documents",
          icon: Archive,
        },
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
  "bank-admin": [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: "/bank", icon: LayoutDashboard },
      ],
    },
    {
      label: "Guarantee Management",
      items: [
        { label: "All Guarantees", href: "/bank/admin/guarantees", icon: ShieldCheck },
        { label: "Pending Actions", href: "/bank/admin/pending", icon: ClipboardCheck },
        { label: "Guarantee Monitoring", href: "/bank/admin/monitoring", icon: ChartNoAxesCombined },
      ],
    },
    {
      label: "Claims",
      items: [
        { label: "All Claims", href: "/bank/claims", icon: ReceiptText },
        { label: "Claim Monitoring", href: "/bank/admin/claim-monitoring", icon: FileSearch },
      ],
    },
    {
      label: "User Management",
      items: [
        { label: "Users", href: "/bank/admin/users", icon: Users },
        { label: "Roles", href: "/bank/admin/roles", icon: UserRoundCog },
        { label: "Permissions", href: "/bank/admin/permissions", icon: ShieldCheck },
      ],
    },
    {
      label: "Bank Configuration",
      items: [
        { label: "Bank Branches", href: "/bank/admin/branches", icon: Network },
        { label: "Approval Matrix", href: "/bank/admin/approval-matrix", icon: GitBranch },
        { label: "SLA Rules", href: "/bank/admin/sla", icon: Clock3 },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Reports", href: "/bank/reports", icon: ChartNoAxesCombined },
        { label: "Notifications", href: "/bank/notifications", icon: Bell, badge: "3" },
        { label: "Profile", href: "/bank/profile", icon: Building2 },
      ],
    },
  ],
  "bank-maker": [
    {
      label: "Workspace",
      items: [
        { label: "Dashboard", href: "/bank", icon: LayoutDashboard },
        { label: "My Guarantees", href: "/bank/my-guarantees", icon: ShieldCheck },
        { label: "Create Guarantee", href: "/bank/create", icon: FileCheck2 },
        { label: "Drafts", href: "/bank/drafts", icon: FileClock },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Notifications", href: "/bank/notifications", icon: Bell, badge: "3" },
        { label: "Profile", href: "/bank/profile", icon: Building2 },
      ],
    },
  ],
  "bank-checker": [
    {
      label: "Review Desk",
      items: [
        { label: "Dashboard", href: "/bank", icon: LayoutDashboard },
        { label: "Pending Reviews", href: "/bank/pending-reviews", icon: ClipboardCheck },
        { label: "Guarantees", href: "/bank/registry", icon: ShieldCheck },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Notifications", href: "/bank/notifications", icon: Bell, badge: "3" },
        { label: "Profile", href: "/bank/profile", icon: Building2 },
      ],
    },
  ],
  "bank-approver": [
    {
      label: "Approval Desk",
      items: [
        { label: "Dashboard", href: "/bank", icon: LayoutDashboard },
        { label: "Pending Approvals", href: "/bank/pending-approvals", icon: BadgeCheck },
        { label: "Digital Signatures", href: "/bank/signatures", icon: FileSignature },
        { label: "Guarantees", href: "/bank/registry", icon: ShieldCheck },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Notifications", href: "/bank/notifications", icon: Bell, badge: "3" },
        { label: "Profile", href: "/bank/profile", icon: Building2 },
      ],
    },
  ],
  "super-admin": [
    {
      label: "Platform",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Organizations", href: "/admin/organizations", icon: Building2 },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Banks", href: "/admin/banks", icon: Landmark },
        { label: "Guarantees", href: "/admin/guarantees", icon: ShieldCheck },
        { label: "Claims", href: "/admin/claims", icon: ReceiptText },
      ],
    },
    {
      label: "Bank Configuration",
      items: [
        { label: "Bank Branches", href: "/admin/branches", icon: Network, permission: "read", badge: "View/Review" },
        { label: "Approval Matrix", href: "/admin/approvals", icon: GitBranch, permission: "read", badge: "View/Review" },
        { label: "SLA Rules", href: "/admin/sla", icon: Clock3, permission: "read", badge: "View/Review" },
      ],
    },
    {
      label: "Oversight",
      items: [
        { label: "Integrations", href: "/admin/integrations", icon: PlugZap },
        { label: "Webhook deliveries", href: "/admin/webhooks", icon: Webhook },
        { label: "Audit logs", href: "/admin/audit", icon: ScrollText },
        { label: "Reports", href: "/admin/reports", icon: ChartNoAxesCombined },
      ],
    },
  ],
};