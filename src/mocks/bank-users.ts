/*
 * MOCK BANK USERS — DEMO ONLY
 */

import type { BankUser } from "@/types";

export const bankUsers: BankUser[] = [
  { id: "bu-001", fullName: "Tigist Alemu", email: "tigist@cbe.com.et", role: "admin", bankId: "bk-cbe", branchId: "br-cbe-01", phone: "+251 91 111 0001", status: "ACTIVE", lastLogin: "2026-09-05", createdAt: "2025-02-10" },
  { id: "bu-002", fullName: "Daniel Berhanu", email: "daniel@cbe.com.et", role: "maker", bankId: "bk-cbe", branchId: "br-cbe-01", phone: "+251 91 111 0002", status: "ACTIVE", lastLogin: "2026-09-06", createdAt: "2025-02-11" },
  { id: "bu-003", fullName: "Henok Getachew", email: "henok@cbe.com.et", role: "checker", bankId: "bk-cbe", branchId: "br-cbe-01", phone: "+251 91 111 0003", status: "ACTIVE", lastLogin: "2026-09-06", createdAt: "2025-03-01" },
  { id: "bu-004", fullName: "Marta Kebede", email: "marta@cbe.com.et", role: "approver", bankId: "bk-cbe", branchId: "br-cbe-01", phone: "+251 91 111 0004", status: "ACTIVE", lastLogin: "2026-09-05", createdAt: "2025-01-20" },
  { id: "bu-005", fullName: "Samuel Girma", email: "samuel@cbe.com.et", role: "maker", bankId: "bk-cbe", branchId: "br-cbe-02", phone: "+251 91 111 0005", status: "ACTIVE", lastLogin: "2026-09-04", createdAt: "2025-04-15" },
  { id: "bu-006", fullName: "Hana Bekele", email: "hana@cbe.com.et", role: "checker", bankId: "bk-cbe", branchId: "br-cbe-03", phone: "+251 91 111 0006", status: "ACTIVE", lastLogin: "2026-09-03", createdAt: "2025-05-02" },
  { id: "bu-007", fullName: "Amanuel Tadesse", email: "amanuel@cbe.com.et", role: "maker", bankId: "bk-cbe", branchId: "br-cbe-04", phone: "+251 91 111 0007", status: "INACTIVE", lastLogin: "2026-07-30", createdAt: "2025-06-18" },
  { id: "bu-008", fullName: "Ruth Solomon", email: "ruth@cbe.com.et", role: "approver", bankId: "bk-cbe", branchId: "br-cbe-02", phone: "+251 91 111 0008", status: "ACTIVE", lastLogin: "2026-09-06", createdAt: "2025-03-22" },
  { id: "bu-009", fullName: "Yonatan Abebe", email: "yonatan@awashbank.et", role: "admin", bankId: "bk-awash", branchId: "br-awash-01", phone: "+251 91 222 0001", status: "ACTIVE", lastLogin: "2026-09-05", createdAt: "2025-02-05" },
  { id: "bu-010", fullName: "Lidya Haile", email: "lidya@awashbank.et", role: "maker", bankId: "bk-awash", branchId: "br-awash-01", phone: "+251 91 222 0002", status: "ACTIVE", lastLogin: "2026-09-04", createdAt: "2025-03-09" },
];
