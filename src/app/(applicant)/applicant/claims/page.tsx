"use client";

import { ClaimsTable, DisputesTable } from "@/features/shared/claims-disputes";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useDemo } from "@/store/demo-store";
import { useState } from "react";

export default function ApplicantClaimsPage() {
  const { claims, disputes, currentUser } = useDemo();
  const [tab, setTab] = useState<string>("claims");

  const scopedClaims = claims.filter((c) => c.applicant === currentUser.organization);
  const scopedDisputes = disputes.filter(
    (d) =>
      d.applicant === currentUser.organization ||
      d.beneficiary === currentUser.organization,
  );

  return (
    <>
      <PageHeader
        eyebrow="Claims & disputes"
        title="Claims and disputes"
        description="Monitor beneficiary demands, decisions, and any escalated disputes handled by the EDGN desk or courts."
      />
      <Tabs
        value={tab}
        onValueChange={setTab}
        tabs={[
          { value: "claims", label: `Claims · ${scopedClaims.length}` },
          { value: "disputes", label: `Disputes · ${scopedDisputes.length}` },
        ]}
      />
      {tab === "claims" ? (
        <ClaimsTable
          claims={scopedClaims}
          emptyMessage="There are no claims involving your organization."
        />
      ) : (
        <DisputesTable
          disputes={scopedDisputes}
          detailPath={() => "/applicant/disputes"}
        />
      )}
      <Card className="mt-6">
        <CardContent className="p-5">
          <p className="text-xs leading-6 text-slate-500">
            Dispute and claim events also appear in your notifications and the
            guarantee timeline when they change the application state.
          </p>
        </CardContent>
      </Card>
    </>
  );
}