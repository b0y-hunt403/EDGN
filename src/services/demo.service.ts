import { applications } from "@/mocks/applications";
import { auditLogs } from "@/mocks/audit-logs";
import { banks } from "@/mocks/banks";
import { claims } from "@/mocks/claims";
import { courtCases } from "@/mocks/court-cases";
import { disputes } from "@/mocks/disputes";
import { guarantees } from "@/mocks/guarantees";
import { integrations } from "@/mocks/integrations";
import { notifications } from "@/mocks/notifications";
import { organizations } from "@/mocks/organizations";
import { mockApi } from "@/lib/mock-api";

export interface DemoData {
  applications: typeof applications;
  auditLogs: typeof auditLogs;
  banks: typeof banks;
  claims: typeof claims;
  courtCases: typeof courtCases;
  disputes: typeof disputes;
  guarantees: typeof guarantees;
  integrations: typeof integrations;
  notifications: typeof notifications;
  organizations: typeof organizations;
}

const initialData: DemoData = {
  applications,
  auditLogs,
  banks,
  claims,
  courtCases,
  disputes,
  guarantees,
  integrations,
  notifications,
  organizations,
};

export const demoService = {
  load(): Promise<DemoData> {
    return mockApi(initialData, { delay: 680 });
  },
};
