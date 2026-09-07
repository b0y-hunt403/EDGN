"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, UserRoundCog, Users, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/form-controls";
import { useDemo } from "@/store/demo-store";
import { bankRoleLabels } from "@/mocks/roles-config";
import type { BankUser, BankUserRole } from "@/types";

type EditorState = { mode: "create" } | { mode: "edit"; user: BankUser } | null;

export function BankUsersPage() {
  const { bankUsers, bankBranches, currentUser, createBankUser, updateBankUser, deleteBankUser, busyAction } =
    useDemo();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editor, setEditor] = useState<EditorState>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "maker" as BankUserRole,
    branchId: "",
    phone: "",
  });

  const rows = useMemo(() => {
    const needle = query.toLowerCase();
    return bankUsers.filter(
      (item) =>
        (roleFilter === "all" || item.role === roleFilter) &&
        [item.fullName, item.email, item.id].join(" ").toLowerCase().includes(needle),
    );
  }, [bankUsers, query, roleFilter]);

  const openCreate = () => {
    setForm({ fullName: "", email: "", role: "maker", branchId: bankBranches[0]?.id ?? "", phone: "" });
    setEditor({ mode: "create" });
  };
  const openEdit = (user: BankUser) => {
    setForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      branchId: user.branchId ?? "",
      phone: user.phone,
    });
    setEditor({ mode: "edit", user });
  };
  const save = () => {
    if (!form.fullName || !form.email) return;
    if (editor?.mode === "edit") {
      void updateBankUser(editor.user.id, form);
    } else {
      void createBankUser({
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        bankId: "bk-cbe",
        branchId: form.branchId || undefined,
        phone: form.phone,
        status: "ACTIVE",
        lastLogin: "Never",
        createdAt: "07 Sep 2026",
      });
    }
    setEditor(null);
  };

  const columns: DataColumn<BankUser>[] = [
    {
      key: "user",
      header: "User",
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800">{item.fullName}</p>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (item) => (
        <div>
          <p className="text-xs font-semibold text-slate-700">{bankRoleLabels[item.role] ?? item.role}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.id}</p>
        </div>
      ),
    },
    {
      key: "branch",
      header: "Branch",
      render: (item) => {
        const branch = bankBranches.find((b) => b.id === item.branchId);
        return <span className="text-xs text-slate-600">{branch?.name ?? "—"}</span>;
      },
    },
    {
      key: "activity",
      header: "Last login",
      render: (item) => <span className="text-xs text-slate-500">{item.lastLogin}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
          {item.status === "ACTIVE" ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-700 hover:bg-rose-50"
              onClick={() => void deleteBankUser(item.id)}
            >
              <UserX className="size-3.5" />
              Deactivate
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void updateBankUser(item.id, { status: "ACTIVE" })}
            >
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Commercial Bank of Ethiopia · User management"
        title="Bank users"
        description="Manage guarantee operations staff, roles, access, and branch assignment."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add user
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={String(bankUsers.length)} icon={Users} tone="navy" />
        <StatCard label="Active" value={String(bankUsers.filter((u) => u.status === "ACTIVE").length)} icon={UserRoundCog} tone="teal" />
        <StatCard label="Approvers" value={String(bankUsers.filter((u) => u.role === "approver").length)} icon={UserRoundCog} tone="amber" />
      </div>
      <Card className="mt-6 overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          filters={[
            {
              ariaLabel: "Role",
              value: roleFilter,
              onChange: setRoleFilter,
              options: [
                { label: "All roles", value: "all" },
                { label: "Maker", value: "maker" },
                { label: "Checker", value: "checker" },
                { label: "Approver", value: "approver" },
                { label: "Bank Admin", value: "admin" },
              ],
            },
          ]}
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          empty={<EmptyState title="No users found" description="No bank users match the current filter." />}
        />
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {rows.length} users · roles enforced from the bank approval matrix
        </div>
      </Card>

      <Modal
        open={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.mode === "edit" ? "Edit bank user" : "Add bank user"}
        description="Prototype record for the connected demo bank."
        footer={
          <>
            <Button variant="outline" onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button disabled={!form.fullName || !form.email || busyAction !== null} onClick={save}>
              {editor?.mode === "edit" ? "Save changes" : "Create user"}
            </Button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" required className="sm:col-span-2">
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Abraham Tesfaye"
            />
          </Field>
          <Field label="Email" required>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@bank.edgn.gov.et"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+251 91 000 0000"
            />
          </Field>
          <Field label="Role">
            <Select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as BankUserRole })}
            >
              <option value="maker">Maker</option>
              <option value="checker">Checker</option>
              <option value="approver">Approver</option>
              <option value="admin">Bank Admin</option>
            </Select>
          </Field>
          <Field label="Branch">
            <Select
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
            >
              {bankBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>
    </>
  );
}