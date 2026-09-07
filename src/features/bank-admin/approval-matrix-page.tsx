"use client";

import { useMemo, useState } from "react";
import { GitBranch, Plus, ShieldCheck, Workflow } from "lucide-react";
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
import { formatMoney } from "@/lib/utils";
import type { ApprovalMatrix } from "@/types";

type EditorState = { mode: "create" } | { mode: "edit"; matrix: ApprovalMatrix } | null;
type FormState = Omit<ApprovalMatrix, "id">;

const emptyForm: FormState = {
  bankId: "bk-cbe",
  guaranteeType: "Performance Guarantee",
  minAmount: 0,
  maxAmount: 1000000,
  requiredApprovers: 1,
  makerRole: "Maker",
  checkerRole: "Checker",
  approverRole: "Approver",
  status: "Active",
};

export function ApprovalMatrixPage() {
  const { approvalMatrices, createApprovalMatrix, updateApprovalMatrix, busyAction } = useDemo();
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<EditorState>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCreate = () => {
    setForm(emptyForm);
    setEditor({ mode: "create" });
  };
  const openEdit = (matrix: ApprovalMatrix) => {
    setForm({
      bankId: matrix.bankId,
      guaranteeType: matrix.guaranteeType,
      minAmount: matrix.minAmount,
      maxAmount: matrix.maxAmount,
      requiredApprovers: matrix.requiredApprovers,
      makerRole: matrix.makerRole,
      checkerRole: matrix.checkerRole,
      approverRole: matrix.approverRole,
      status: matrix.status,
    });
    setEditor({ mode: "edit", matrix });
  };
  const save = () => {
    if (!form.guaranteeType) return;
    if (editor?.mode === "edit") {
      void updateApprovalMatrix(editor.matrix.id, form);
    } else {
      void createApprovalMatrix(form);
    }
    setEditor(null);
  };

  const rows = useMemo(() => {
    const needle = query.toLowerCase();
    return approvalMatrices.filter((item) =>
      [item.guaranteeType, item.makerRole, item.checkerRole, item.approverRole]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [approvalMatrices, query]);

  const columns: DataColumn<ApprovalMatrix>[] = [
    {
      key: "type",
      header: "Guarantee type",
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800">{item.guaranteeType}</p>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.id}</p>
        </div>
      ),
    },
    {
      key: "band",
      header: "Amount band (ETB)",
      render: (item) => (
        <span className="font-mono text-xs font-semibold">
          {formatMoney(item.minAmount)} — {formatMoney(item.maxAmount)}
        </span>
      ),
    },
    {
      key: "approvers",
      header: "Required approvers",
      render: (item) => <span className="text-xs font-semibold text-slate-700">{item.requiredApprovers}</span>,
    },
    {
      key: "roles",
      header: "Workflow roles",
      render: (item) => (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">{item.makerRole}</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">{item.checkerRole}</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-md bg-[#0f6f68]/10 px-2 py-0.5 text-[#0f6f68]">{item.approverRole}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Commercial Bank of Ethiopia · Configuration"
        title="Approval matrix"
        description="Maker → checker → approver routing rules by guarantee type and amount band."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add rule
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active rules" value={String(approvalMatrices.filter((m) => m.status === "Active").length)} icon={GitBranch} tone="navy" />
        <StatCard label="Approver level" value="2" icon={ShieldCheck} tone="teal" helper="Dual control above SDK bands" />
        <StatCard label="Routing" value="M→C→A" icon={Workflow} tone="amber" helper="Maker, checker, approver" />
      </div>
      <Card className="mt-6 overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search by guarantee type or role"
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          empty={<EmptyState title="No rules found" description="No approval matrix rules match the filter." />}
        />
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {rows.length} rules · the highest applicable band determines approval depth
        </div>
      </Card>

      <Modal
        open={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.mode === "edit" ? "Edit approval rule" : "Add approval rule"}
        description="Prototype routing rule for the connected demo bank."
        footer={
          <>
            <Button variant="outline" onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button disabled={!form.guaranteeType || busyAction !== null} onClick={save}>
              {editor?.mode === "edit" ? "Save changes" : "Create rule"}
            </Button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Guarantee type" required className="sm:col-span-2">
            <Select
              value={form.guaranteeType}
              onChange={(e) => setForm({ ...form, guaranteeType: e.target.value })}
            >
              <option>Performance Guarantee</option>
              <option>Bid/Tender Guarantee</option>
              <option>Advance Payment Guarantee</option>
              <option>Payment Guarantee</option>
            </Select>
          </Field>
          <Field label="Min amount (ETB)">
            <Input
              type="number"
              value={form.minAmount}
              onChange={(e) => setForm({ ...form, minAmount: Number(e.target.value) })}
            />
          </Field>
          <Field label="Max amount (ETB)">
            <Input
              type="number"
              value={form.maxAmount}
              onChange={(e) => setForm({ ...form, maxAmount: Number(e.target.value) })}
            />
          </Field>
          <Field label="Required approvers">
            <Select
              value={String(form.requiredApprovers)}
              onChange={(e) => setForm({ ...form, requiredApprovers: Number(e.target.value) })}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>
      </Modal>
    </>
  );
}