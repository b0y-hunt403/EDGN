import type { NotificationRecord } from "@/types";

export const notifications: NotificationRecord[] = [
  {
    id: "ntf-001",
    title: "Application ready for your review",
    message: "APP-2026-00941 has 1h 42m remaining on its maker SLA.",
    time: "12 min ago",
    category: "workflow",
    read: false,
    href: "/bank/applications/app-00941/maker",
  },
  {
    id: "ntf-002",
    title: "Guarantee approaches expiry",
    message: "EDGN-2026-004867 expires in 8 days. Review extension needs.",
    time: "38 min ago",
    category: "expiry",
    read: false,
    href: "/applicant/guarantees/g-004867",
  },
  {
    id: "ntf-003",
    title: "Court information request received",
    message: "FFIC-CIV-2026-01842 requires a response by 04 September.",
    time: "1 hr ago",
    category: "workflow",
    read: false,
    href: "/court/cases/court-01842",
  },
  {
    id: "ntf-004",
    title: "Bank of Abyssinia adapter degraded",
    message: "Guarantee status requests are above the latency threshold.",
    time: "2 hrs ago",
    category: "integration",
    read: true,
    href: "/admin/integrations",
  },
  {
    id: "ntf-005",
    title: "New session verified",
    message: "A browser session from Addis Ababa was verified with MFA.",
    time: "Yesterday",
    category: "security",
    read: true,
    href: "/applicant/security",
  },
];
