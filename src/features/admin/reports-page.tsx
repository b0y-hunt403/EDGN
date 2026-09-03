"use client";

import { Download, FileBarChart, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DonutChart, BarChart, VerticalBars } from "@/components/shared/charts";
import {
  bankExposure,
  guaranteeStatusDistribution,
  monthlyIssuance,
} from "@/mocks/dashboard";
import { useDemo } from "@/store/demo-store";

export function AdminReportsPage() {
  const { addToast } = useDemo();
  return (
    <>
      <PageHeader
        eyebrow="Network analytics"
        title="Reports & analytics"
        description="Operational, institutional, audit, and regulatory-ready reporting."
        actions={
          <Button onClick={() => addToast("Report generated", "EDGN Network Overview · September 2026 is ready.")}>
            <Download className="size-4" />
            Generate report
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Network operations", "Volume, value, lifecycle, SLA", FileBarChart],
          ["Institutional activity", "Bank and organization participation", ShieldCheck],
          ["Audit & risk", "Exceptions, alerts, privileged events", FileBarChart],
        ].map(([title, description, Icon]) => {
          const IconComponent = Icon as typeof FileBarChart;
          return (
            <Card key={String(title)} className="p-5">
              <IconComponent className="size-5 text-[#0f6f68]" />
              <p className="mt-4 text-sm font-semibold text-slate-900">{String(title)}</p>
              <p className="mt-1 text-xs text-slate-500">{String(description)}</p>
              <Button variant="outline" size="sm" className="mt-4">Configure</Button>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Guarantee status distribution" />
          <CardContent>
            <DonutChart data={guaranteeStatusDistribution} centerLabel="Guarantees" centerValue="4,862" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Exposure by bank" />
          <CardContent><BarChart data={bankExposure} /></CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title="Monthly issuance" />
          <CardContent><VerticalBars data={monthlyIssuance} /></CardContent>
        </Card>
      </div>
    </>
  );
}
