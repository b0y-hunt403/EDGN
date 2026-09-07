import { applications } from "@/mocks/applications";
import { auditLogs } from "@/mocks/audit-logs";
import { banks } from "@/mocks/banks";
import { bankBranches } from "@/mocks/branches";
import { bankUsers } from "@/mocks/bank-users";
import { bankRoles } from "@/mocks/roles-config";
import { approvalMatrices } from "@/mocks/approval-matrices";
import { slaRules } from "@/mocks/sla-rules";
import { claims } from "@/mocks/claims";
import { courtCases } from "@/mocks/court-cases";
import { disputes } from "@/mocks/disputes";
import { guarantees } from "@/mocks/guarantees";
import { integrations } from "@/mocks/integrations";
import { notifications } from "@/mocks/notifications";
import { organizations } from "@/mocks/organizations";
import { signatures } from "@/mocks/signatures";
import { mockApi } from "@/lib/mock-api";

export interface DemoData {
  applications: typeof applications;
  auditLogs: typeof auditLogs;
  banks: typeof banks;
  bankBranches: typeof bankBranches;
  bankUsers: typeof bankUsers;
  bankRoles: typeof bankRoles;
  approvalMatrices: typeof approvalMatrices;
  slaRules: typeof slaRules;
  claims: typeof claims;
  courtCases: typeof courtCases;
  disputes: typeof disputes;
  guarantees: typeof guarantees;
  integrations: typeof integrations;
  notifications: typeof notifications;
  organizations: typeof organizations;
  signatures: typeof signatures;
}

const initialData: DemoData = {
  applications,
  auditLogs,
  banks,
  bankBranches,
  bankUsers,
  bankRoles,
  approvalMatrices,
  slaRules,
  claims,
  courtCases,
  disputes,
  guarantees,
  integrations,
  notifications,
  organizations,
  signatures,
};

export const demoService = {
  load(): Promise<DemoData> {
    return mockApi(initialData, { delay: 680 });
  },
};
