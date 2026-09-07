/*
 * ROLE PERMISSIONS — DEMO ONLY
 *
 * Centralized frontend-only permission configuration.
 * Production must enforce real server-side authorization.
 */

import type { DemoRoleId } from "@/types";

export type Permission =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "review"
  | "approve"
  | "verify";

export interface ModulePermissions {
  [module: string]: Permission[];
}

export const rolePermissions: Record<DemoRoleId, ModulePermissions> = {
  "super-admin": {
    guarantees: ["read", "review"],
    claims: ["read", "review"],
    banks: ["read", "review"],
    branches: ["read", "review"],
    approvalMatrix: ["read", "review"],
    slaRules: ["read", "review"],
    users: ["read"],
    audit: ["read"],
    integrations: ["read"],
    reports: ["read"],
  },
  "bank-admin": {
    guarantees: ["create", "read", "update", "review"],
    claims: ["read", "update", "review"],
    branches: ["create", "read", "update", "delete"],
    approvalMatrix: ["create", "read", "update"],
    slaRules: ["create", "read", "update"],
    users: ["create", "read", "update", "delete"],
    roles: ["create", "read", "update"],
    reports: ["read"],
  },
  "bank-maker": {
    guarantees: ["create", "read", "update"],
    applications: ["create", "read", "update"],
    documents: ["create", "read", "update"],
  },
  "bank-checker": {
    guarantees: ["read", "review"],
    applications: ["read", "update", "review"],
    documents: ["read", "verify"],
  },
  "bank-approver": {
    guarantees: ["read", "review", "approve"],
    applications: ["read", "review", "approve"],
    signatures: ["read", "approve"],
  },
  applicant: {
    guarantees: ["create", "read", "update"],
    applications: ["create", "read", "update", "delete"],
    documents: ["create", "read", "update"],
  },
  beneficiary: {
    guarantees: ["read"],
    claims: ["create", "read"],
    documents: ["read", "create"],
  },
};

export function hasPermission(
  role: DemoRoleId,
  module: string,
  permission: Permission,
): boolean {
  const modules = rolePermissions[role];
  if (!modules) return false;
  const perms = modules[module];
  if (!perms) return false;
  return perms.includes(permission);
}

export function getModulePermissions(
  role: DemoRoleId,
  module: string,
): Permission[] {
  return rolePermissions[role]?.[module] ?? [];
}
