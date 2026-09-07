"use client";

import Link from "next/link";
import { ArrowLeft, LifeBuoy, Route } from "lucide-react";
import { ApplicantDashboard } from "@/features/applicant/applicant-dashboard";
import { ApplicantApplicationDetail } from "@/features/applicant/application-detail";
import { NewGuaranteeWizard } from "@/features/applicant/new-guarantee-wizard";
import { BeneficiaryDashboard } from "@/features/beneficiary/beneficiary-dashboard";
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
import { GuaranteeList } from "@/features/guarantees/guarantee-list";
import { GuaranteeDetail } from "@/features/guarantees/guarantee-detail";
import { ClaimsPage } from "@/features/common/claims-page";
import { DisputesPage } from "@/features/common/disputes-page";
import { DocumentCenter } from "@/features/common/document-center";
import { LifecycleRequests } from "@/features/common/lifecycle-requests";
import { NotificationsPage } from "@/features/common/notifications-page";
import { ProfilePage } from "@/features/common/profile-page";
import { SecurityPage } from "@/features/common/security-page";
import { SignatureList } from "@/features/signatures/signature-list";
import { ClaimsWorking } from "@/features/claims/claims-working";
import { ClaimDetail } from "@/features/claims/claim-detail";
import { BankUsersPage } from "@/features/bank-admin/users-page";
import { BankBranchesPage } from "@/features/bank-admin/branches-page";
import { ApprovalMatrixPage } from "@/features/bank-admin/approval-matrix-page";
import { SlaRulesPage } from "@/features/bank-admin/sla-page";
import { BankRolesPage } from "@/features/bank-admin/roles-page";
import { BankPermissionsPage } from "@/features/bank-admin/permissions-page";
import { GuaranteeMonitoring } from "@/features/bank-admin/monitoring-page";
import { ClaimMonitoringPage } from "@/features/bank-admin/claim-monitoring-page";
import { PendingActionsPage } from "@/features/bank-admin/pending-page";
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
    if (first === "claims" && second) return <ClaimDetail claimId={second} />;
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
    if (first === "claims" && second) return <ClaimDetail claimId={second} />;
    if (first === "claims") return <ClaimsPage portal="beneficiary" />;
    if (first === "documents") return <DocumentCenter />;
    if (first === "disputes") return <DisputesPage portal="beneficiary" />;
    if (first === "notifications") return <NotificationsPage />;
    if (first === "profile") return <ProfilePage />;
  }

  if (portal === "bank") {
    if (!first) return <BankDashboard />;
    if (first === "my-guarantees") return <GuaranteeList portal="bank" />;
    if (first === "create") return <NewGuaranteeWizard />;
    if (first === "drafts") return <WorkQueue queueType="maker" />;
    if (first === "pending-reviews") return <WorkQueue queueType="checker" />;
    if (first === "pending-approvals") return <WorkQueue queueType="approver" />;
    if (first === "signatures") return <SignatureList />;
    if (first === "registry") return <GuaranteeList portal="bank" />;
    if (first === "guarantees" && second) return <GuaranteeDetail portal="bank" guaranteeId={second} />;
    if (first === "claims" && second) return <ClaimDetail claimId={second} />;
    if (first === "claims") return <ClaimsWorking />;
    if (first === "applications" && second && third === "maker") return <ApplicationReview applicationId={second} mode="maker" />;
    if (first === "applications" && second && third === "checker") return <ApplicationReview applicationId={second} mode="checker" />;
    if (first === "applications" && second && third === "sign") return <SignatoryFlow applicationId={second} />;
    if (second === "users") return <BankUsersPage />;
    if (second === "branches") return <BankBranchesPage />;
    if (second === "approval-matrix") return <ApprovalMatrixPage />;
    if (second === "sla") return <SlaRulesPage />;
    if (second === "roles") return <BankRolesPage />;
    if (second === "permissions") return <BankPermissionsPage />;
    if (second === "guarantees") return <GuaranteeList portal="bank" />;
    if (second === "pending") return <PendingActionsPage />;
    if (second === "monitoring") return <GuaranteeMonitoring />;
    if (second === "claim-monitoring") return <ClaimMonitoringPage />;
    if (first === "disputes") return <DisputesPage portal="bank" />;
    if (["collateral", "alerts", "instructions", "exposure", "history"].includes(first)) return <BankOperationsPage view={first as BankOperationsView} />;
    if (first === "reports") return <BankOperationsPage view="reports" />;
    if (first === "notifications") return <NotificationsPage />;
    if (first === "profile") return <ProfilePage />;
  }

  if (portal === "admin") {
    if (!first) return <AdminDashboard />;
    if (first === "guarantees" && second) return <GuaranteeDetail portal="admin" guaranteeId={second} />;
    if (first === "guarantees") return <GuaranteeList portal="admin" />;
    if (first === "claims") return <ClaimsWorking monitoring />;
    if (first === "integrations") return <IntegrationMonitor />;
    if (first === "webhooks") return <WebhookMonitor />;
    if (first === "audit") return <AuditPage />;
    if (first === "reports") return <AdminReportsPage />;
    if (["organizations", "users", "roles", "banks", "branches", "guarantee-types", "templates", "rules", "approvals", "sla", "notifications", "fraud", "api-clients", "feature-flags"].includes(first)) return <ManagementPage datasetKey={first} />;
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