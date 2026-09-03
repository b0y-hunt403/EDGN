import type { ApiClient, WebhookDelivery } from "@/types";

export const apiClients: ApiClient[] = [
  {
    id: "cli_aacra_sbx_81k3",
    name: "AACRA Procurement Sandbox",
    organization: "Addis Ababa City Roads Authority",
    environment: "Sandbox",
    status: "Active",
    requests: "18,429 this month",
    lastUsed: "2 min ago",
    scopes: ["guarantees:verify", "guarantees:read", "webhooks:manage"],
  },
  {
    id: "cli_eep_prod_29f1",
    name: "EEP Contract Management",
    organization: "Ethiopian Electric Power",
    environment: "Production",
    status: "Active",
    requests: "42,117 this month",
    lastUsed: "8 min ago",
    scopes: ["guarantees:verify", "guarantees:read"],
  },
  {
    id: "cli_motri_sbx_991a",
    name: "MoTRI Integration Lab",
    organization: "Ministry of Trade and Regional Integration",
    environment: "Sandbox",
    status: "Suspended",
    requests: "1,204 this month",
    lastUsed: "24 Aug 2026",
    scopes: ["guarantees:verify"],
  },
];

export const webhookDeliveries: WebhookDelivery[] = [
  {
    id: "whd-882744",
    event: "guarantee.issued",
    endpoint: "https://sandbox.aacra.demo/edgn/events",
    status: "Delivered",
    responseCode: 204,
    attempts: 1,
    timestamp: "01 Sep, 09:12:44",
  },
  {
    id: "whd-882743",
    event: "claim.created",
    endpoint: "https://sandbox.aacra.demo/edgn/events",
    status: "Delivered",
    responseCode: 200,
    attempts: 1,
    timestamp: "01 Sep, 08:41:17",
  },
  {
    id: "whd-882742",
    event: "guarantee.expiring",
    endpoint: "https://api.eep.demo/webhooks/edgn",
    status: "Delivered",
    responseCode: 202,
    attempts: 1,
    timestamp: "01 Sep, 08:30:05",
  },
  {
    id: "whd-882741",
    event: "court.information.requested",
    endpoint: "https://sandbox.aacra.demo/edgn/events",
    status: "Retrying",
    responseCode: 503,
    attempts: 2,
    timestamp: "01 Sep, 08:24:51",
  },
];

export const endpointExamples = [
  {
    method: "GET",
    path: "/api/v1/verify/{reference}",
    summary: "Verify a guarantee using a public-safe projection",
    scope: "guarantees:verify",
  },
  {
    method: "GET",
    path: "/api/v1/guarantees/{id}",
    summary: "Retrieve an authorized guarantee record",
    scope: "guarantees:read",
  },
  {
    method: "POST",
    path: "/api/v1/guarantees/{id}/claims",
    summary: "Submit a beneficiary claim",
    scope: "claims:write",
  },
  {
    method: "POST",
    path: "/api/v1/judicial/cases/referrals",
    summary: "Refer an authorized dispute to a judicial institution",
    scope: "judicial:refer",
  },
];

export const apiUsage = [
  { label: "Mar", value: 18420 },
  { label: "Apr", value: 23180 },
  { label: "May", value: 27640 },
  { label: "Jun", value: 31890 },
  { label: "Jul", value: 38920 },
  { label: "Aug", value: 42117 },
  { label: "Sep", value: 18429 },
];

export const apiProducts = [
  {
    name: "Guarantee Verification API",
    description: "Validate a public verification reference using a privacy-safe response projection.",
    version: "v1",
    availability: "99.99%",
    status: "Stable",
  },
  {
    name: "Institutional Guarantee API",
    description: "Retrieve authorized guarantee records and lifecycle notifications for a registered organization.",
    version: "v1",
    availability: "99.97%",
    status: "Stable",
  },
  {
    name: "Claims API",
    description: "Submit and track beneficiary claims with idempotent request handling.",
    version: "v1",
    availability: "99.95%",
    status: "Sandbox",
  },
];

export const webhookEvents = [
  { event: "guarantee.issued", description: "A signed guarantee was issued and registered.", deliveries: "12,842", enabled: true },
  { event: "guarantee.expiring", description: "A guarantee entered a configured expiry notification window.", deliveries: "4,106", enabled: true },
  { event: "claim.created", description: "An authorized beneficiary submitted a new claim.", deliveries: "284", enabled: true },
  { event: "claim.status_changed", description: "A claim moved to a different lifecycle state.", deliveries: "671", enabled: true },
  { event: "dispute.referred", description: "A dispute was referred through an authorized workflow.", deliveries: "38", enabled: false },
];

export const changelogEntries = [
  {
    date: "28 Aug 2026",
    version: "2026-08-28",
    title: "Idempotency and verification response improvements",
    items: ["Added Idempotency-Key support to claim creation", "Added registryVersion to verification responses", "Clarified 429 retry headers"],
  },
  {
    date: "12 Aug 2026",
    version: "2026-08-12",
    title: "New guarantee lifecycle webhook events",
    items: ["Added guarantee.amended", "Added guarantee.released", "Webhook signatures now include timestamp tolerance guidance"],
  },
  {
    date: "21 Jul 2026",
    version: "2026-07-21",
    title: "Sandbox data refresh",
    items: ["Expanded Ethiopian procurement scenarios", "Added claim rejection examples", "Improved error response descriptions"],
  },
];

export const rateLimitTiers = [
  { name: "Verification", limit: "600 requests / minute", burst: "1,000", current: "18%", reset: "Sliding window" },
  { name: "Institutional reads", limit: "300 requests / minute", burst: "500", current: "24%", reset: "Sliding window" },
  { name: "Workflow mutations", limit: "60 requests / minute", burst: "100", current: "7%", reset: "Sliding window" },
  { name: "Webhook management", limit: "30 requests / minute", burst: "50", current: "3%", reset: "Sliding window" },
];
