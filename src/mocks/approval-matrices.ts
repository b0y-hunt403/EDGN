/*
 * MOCK APPROVAL MATRICES — DEMO ONLY
 */

import type { ApprovalMatrix } from "@/types";

export const approvalMatrices: ApprovalMatrix[] = [
  { id: "am-001", bankId: "bk-cbe", guaranteeType: "Bid Bond", minAmount: 0, maxAmount: 5_000_000, requiredApprovers: 1, makerRole: "maker", checkerRole: "checker", approverRole: "approver", status: "Active" },
  { id: "am-002", bankId: "bk-cbe", guaranteeType: "Performance Bond", minAmount: 0, maxAmount: 10_000_000, requiredApprovers: 1, makerRole: "maker", checkerRole: "checker", approverRole: "approver", status: "Active" },
  { id: "am-003", bankId: "bk-cbe", guaranteeType: "Advance Payment", minAmount: 0, maxAmount: 20_000_000, requiredApprovers: 2, makerRole: "maker", checkerRole: "checker", approverRole: "approver", status: "Active" },
  { id: "am-004", bankId: "bk-cbe", guaranteeType: "Retention Bond", minAmount: 0, maxAmount: 5_000_000, requiredApprovers: 1, makerRole: "maker", checkerRole: "checker", approverRole: "approver", status: "Active" },
  { id: "am-005", bankId: "bk-cbe", guaranteeType: "Customs Bond", minAmount: 0, maxAmount: 15_000_000, requiredApprovers: 1, makerRole: "maker", checkerRole: "checker", approverRole: "approver", status: "Active" },
  { id: "am-006", bankId: "bk-awash", guaranteeType: "Bid Bond", minAmount: 0, maxAmount: 3_000_000, requiredApprovers: 1, makerRole: "maker", checkerRole: "checker", approverRole: "approver", status: "Active" },
  { id: "am-007", bankId: "bk-dashen", guaranteeType: "Performance Bond", minAmount: 0, maxAmount: 8_000_000, requiredApprovers: 1, makerRole: "maker", checkerRole: "checker", approverRole: "approver", status: "Inactive" },
];
