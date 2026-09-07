"use client";

import { useMemo, useState } from "react";
import { Building2, Landmark, Network, Plus } from "lucide-react";
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
import type { BankBranch } from "@/types";

type EditorState = { mode: "create" } | { mode: "edit"; branch: BankBranch } | null;

export function BankBranchesPage() {
  const { bankBranches, banks, createBranch, updateBranch, busyAction } = useDemo();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editor, setEditor] = useState<EditorState>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    region: "",
    city: "",
    manager: "",
    phone: "",
  });

  const openCreate = () => {
    setForm({ name: "", code: "", region: "", city: "", manager: "", phone: "" });
    setEditor({ mode: "create" });
  };
  const openEdit = (branch: BankBranch) => {
    setForm({
      name: branch.name,
      code: branch.code,
      region: branch.region,
      city: branch.city,
      manager: branch.manager,
      phone: branch.phone,
    });
    setEditor({ mode: "edit", branch });
  };
  const save = () => {
    if (!form.name || !form.code || !form.city) return;
    if (editor?.mode === "edit") {
      void updateBranch(editor.branch.id, form);
    } else {
      void createBranch({
        ...form,
        bankId: "bk-cbe",
        status: "Active",
      });
    }
    setEditor(null);
  };
  const toggleStatus = (branch: BankBranch) =>
    void updateBranch(branch.id, {
      status: branch.status === "Active" ? "Inactive" : "Active",
    });

  const rows = useMemo(() => {
    const needle = query.toLowerCase();
    return bankBranches.filter(
      (item) =>
        (statusFilter === "all" || item.status === statusFilter) &&
        [item.name, item.code, item.city, item.region, item.manager]
          .join(" ")
          .toLowerCase()
          .includes(needle),
    );
  }, [bankBranches, query, statusFilter]);

  const columns: DataColumn<BankBranch>[] = [
    {
      key: "branch",
      header: "Branch",
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800">{item.name}</p>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">{item.code}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item) => (
        <span className="text-xs text-slate-600">
          {item.city}, {item.region}
        </span>
      ),
    },
    {
      key: "manager",
      header: "Manager",
      render: (item) => (
        <div>
          <p className="text-xs font-medium text-slate-700">{item.manager}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.phone}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleStatus(item)}
            className={
              item.status === "Active"
                ? "text-rose-700 hover:bg-rose-50"
                : "text-emerald-700 hover:bg-emerald-50"
            }
          >
            {item.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Commercial Bank of Ethiopia · Configuration"
        title="Bank branches"
        description="Branch network for guarantee origination, collateral custody, and SLA routing."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add branch
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total branches" value={String(bankBranches.length)} icon={Network} tone="navy" />
        <StatCard label="Active" value={String(bankBranches.filter((b) => b.status === "Active").length)} icon={Landmark} tone="teal" />
        <StatCard label="Bank" value={banks[0]?.name ?? "Commercial Bank of Ethiopia"} icon={Building2} tone="amber" helper="Connected demo institution" />
      </div>
      <Card className="mt-6 overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          filters={[
            {
              ariaLabel: "Branch status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "All statuses", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Under review", value: "Under review" },
              ],
            },
          ]}
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          empty={<EmptyState title="No branches found" description="No branches match the current filter." />}
        />
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {rows.length} branches · registration and collateral custody routes
        </div>
      </Card>

      <Modal
        open={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.mode === "edit" ? "Edit branch" : "Add branch"}
        description="Prototype branch registration for the connected demo bank."
        footer={
          <>
            <Button variant="outline" onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button disabled={!form.name || !form.code || !form.city || busyAction !== null} onClick={save}>
              {editor?.mode === "edit" ? "Save changes" : "Create branch"}
            </Button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Branch name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Addis Ababa Head Office" />
          </Field>
          <Field label="Branch code" required>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. 00-001" />
          </Field>
          <Field label="Region">
            <Select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
              <option value="Addis Ababa">Addis Ababa</option>
              <option value="Oromia">Oromia</option>
              <option value="Amhara">Amhara</option>
              <option value="Tigray">Tigray</option>
              <option value="SNNPR">SNNPR</option>
              <option value="Somali">Somali</option>
            </Select>
          </Field>
          <Field label="City" required>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Addis Ababa" />
          </Field>
          <Field label="Branch manager">
            <Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} placeholder="Full name" />
          </Field>
          <Field label="Contact phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+251 11 000 0000" />
          </Field>
        </div>
      </Modal>
    </>
  );
}