"use client";

import Link from "next/link";
import { ArrowLeft, LifeBuoy, Route } from "lucide-react";
import { ApplicantDashboard } from "@/features/applicant/applicant-dashboard";
import { ApplicantApplicationDetail } from "@/features/applicant/application-detail";
import { NewGuaranteeWizard } from "@/features/applicant/new-guarantee-wizard";
import { BeneficiaryDashboard } from "@/features/beneficiary/beneficiary-dashboard";
import { BeneficiaryVerification } from "@/features/beneficiary/beneficiary-verification";
import { ExpiringGuarantees } from "@/features/beneficiary/expiring-guarantees";
import { BankDashboard } from "@/features/bank/bank-dashboard";
import { WorkQueue } from "@/features/bank/work-queue";
import { ApplicationReview } from "@/features/bank/application-review";
import { SignatoryFlow } from "@/features/bank/signatory-flow";
import { BankOperationsPage, type BankOperationsView } from "@/features/bank/bank-operations-page";
import { AdminDashboard } from "@/features/admin/admin-dashboard";
import { ManagementPage } from "@/features/admin/management-page";
import { IntegrationMonitor } from "@/features/admin/integration-monitor";
import { WebhookMonitor } from "@/features/admin/webhook-monitor";
import { AuditPage } from "@/features/admin/audit-page";
import { AdminReportsPage } from "@/features/admin/reports-page";
import { CourtDashboard } from "@/features/court/court-dashboard";
import { CourtCaseList } from "@/features/court/court-case-list";
import { CourtCaseDetail } from "@/features/court/court-case-detail";
import { CourtRecordsPage, type CourtRecordsView } from "@/features/court/court-records-page";
import { DeveloperDashboard } from "@/features/developer/developer-dashboard";
import { ApiClientsPage } from "@/features/developer/api-clients-page";
import { DeveloperWebhooksPage } from "@/features/developer/developer-webhooks-page";
import { DeveloperReferencePage, type DeveloperReferenceView } from "@/features/developer/developer-reference-page";
import { GuaranteeList } from "@/features/guarantees/guarantee-list";
import { GuaranteeDetail } from "@/features/guarantees/guarantee-detail";
import { ClaimsPage } from "@/features/common/claims-page";
import { DisputesPage } from "@/features/common/disputes-page";
import { DocumentCenter } from "@/features/common/document-center";
import { LifecycleRequests } from "@/features/common/lifecycle-requests";
import { NotificationsPage } from "@/features/common/notifications-page";
import { ProfilePage } from "@/features/common/profile-page";
import { SecurityPage } from "@/features/common/security-page";
import { Card, CardContent } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import type { PortalId } from "@/types";

export function WorkspaceRouter({ portal, slug }: { portal: PortalId; slug: string[] }) {
  const [first = "", second = "", third = ""] = slug;

  if (portal === "applicant") {
    if (!first) return <ApplicantDashboard />;
    if (first === "applications" && second === "new") return <NewGuaranteeWizard />;
    if (first === "applications" && second) return <ApplicantApplicationDetail applicationId={second} />;
    if (first === "guarantees" && second) return <GuaranteeDetail portal="applicant" guaranteeId={second} />;
    if (first === "guarantees") return <GuaranteeList portal="applicant" />;
    if (first === "documents") return <DocumentCenter />;
    if (first === "requests") return <LifecycleRequests />;
    if (first === "claims") return <ClaimsPage portal="applicant" />;
    if (first === "disputes") return <DisputesPage portal="applicant" />;
    if (first === "notifications") return <NotificationsPage />;
    if (first === "profile") return <ProfilePage />;
    if (first === "security") return <SecurityPage />;
  }

  if (portal === "beneficiary") {
    if (!first) return <BeneficiaryDashboard />;
    if (first === "guarantees" && second) return <GuaranteeDetail portal="beneficiary" guaranteeId={second} />;
    if (first === "guarantees") return <GuaranteeList portal="beneficiary" />;
    if (first === "verification") return <BeneficiaryVerification />;
    if (first === "expiring") return <ExpiringGuarantees />;
    if (first === "extensions") return <LifecycleRequests mode="extensions" />;
    if (first === "claims") return <ClaimsPage portal="beneficiary" />;
    if (first === "releases") return <LifecycleRequests mode="releases" />;
    if (first === "disputes") return <DisputesPage portal="beneficiary" />;
    if (first === "evidence") return <DocumentCenter />;
    if (first === "notifications") return <NotificationsPage />;
    if (first === "profile") return <ProfilePage />;
  }

  if (portal === "bank") {
    if (!first) return <BankDashboard />;
    if (first === "work-queue") return <WorkQueue queueType="maker" />;
    if (first === "approvals") return <WorkQueue queueType="checker" />;
    if (first === "signatures") return <WorkQueue queueType="signatory" />;
    if (first === "applications" && second && third === "maker") return <ApplicationReview applicationId={second} mode="maker" />;
    if (first === "applications" && second && third === "checker") return <ApplicationReview applicationId={second} mode="checker" />;
    if (first === "applications" && second && third === "sign") return <SignatoryFlow applicationId={second} />;
    if (first === "registry") return <GuaranteeList portal="bank" />;
    if (first === "guarantees" && second) return <GuaranteeDetail portal="bank" guaranteeId={second} />;
    if (first === "claims") return <ClaimsPage portal="bank" />;
    if (first === "disputes") return <DisputesPage portal="bank" />;
    if (["collateral", "alerts", "instructions", "exposure", "reports", "history"].includes(first)) return <BankOperationsPage view={first as BankOperationsView} />;
  }

  if (portal === "admin") {
    if (!first) return <AdminDashboard />;
    if (first === "guarantees" && second) return <GuaranteeDetail portal="admin" guaranteeId={second} />;
    if (first === "integrations") return <IntegrationMonitor />;
    if (first === "webhooks") return <WebhookMonitor />;
    if (first === "audit") return <AuditPage />;
    if (first === "reports") return <AdminReportsPage />;
    if (["organizations", "users", "roles", "banks", "branches", "guarantee-types", "templates", "rules", "approvals", "sla", "notifications", "fraud", "api-clients", "feature-flags"].includes(first)) return <ManagementPage datasetKey={first} />;
  }

  if (portal === "court") {
    if (!first) return <CourtDashboard />;
    if (first === "cases" && second) return <CourtCaseDetail caseId={second} />;
    if (first === "cases") return <CourtCaseList />;
    if (["evidence", "information-requests", "hearings", "decisions", "appeals", "instructions", "execution", "closed"].includes(first)) return <CourtRecordsPage view={first as CourtRecordsView} />;
  }

  if (portal === "developer") {
    if (!first) return <DeveloperDashboard />;
    if (first === "clients") return <ApiClientsPage />;
    if (first === "webhooks") return <DeveloperWebhooksPage />;
    if (["sandbox", "usage", "docs", "explorer", "authentication", "changelog"].includes(first)) return <DeveloperReferencePage view={first as DeveloperReferenceView} />;
  }

  return <WorkspaceRouteNotFound portal={portal} />;
}

function WorkspaceRouteNotFound({ portal }: { portal: PortalId }) {
  return (
    <div className="mx-auto max-w-xl py-16">
      <Card><CardContent className="p-10 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><Route className="size-6" /></div><h1 className="mt-4 text-lg font-semibold text-slate-950">Workspace page not found</h1><p className="mt-2 text-sm leading-6 text-slate-500">This route is not part of the presentation workspace. Return to the role dashboard or open the demo guide.</p><div className="mt-6 flex justify-center gap-2"><Link href={"/" + portal} className={buttonStyles("primary")}><ArrowLeft className="size-4" />Role dashboard</Link><Link href="/help" className={buttonStyles("outline")}><LifeBuoy className="size-4" />Demo guide</Link></div></CardContent></Card>
    </div>
  );
}
