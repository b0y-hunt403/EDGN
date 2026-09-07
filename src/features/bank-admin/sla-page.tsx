"use client";

import { useMemo, useState } from "react";
import { Clock3, Gauge, Plus, Timer } from "lucide-react";
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
import type { SlaRule } from "@/types";

type EditorState = { mode: "create" } | { mode: "edit"; rule: SlaRule } | null;
type FormState = Omit<SlaRule, "id">;

const emptyForm: FormState = {
  bankId: "bk-cbe",
  name: "",
  description: "",
  stage: "Maker review",
  targetHours: 24,
  escalationHours: 12,
  notifyRoles: ["bank-maker", "bank-checker", "bank-approver", "bank-admin"],
  status: "Active",
};

export function SlaRulesPage() {
  const { slaRules, createSlaRule, updateSlaRule, busyAction } = useDemo();
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<EditorState>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCreate = () => {
    setForm(emptyForm);
    setEditor({ mode: "create" });
  };
  const openEdit = (rule: SlaRule) => {
    setForm({
      bankId: rule.bankId,
      name: rule.name,
      description: rule.description,
      stage: rule.stage,
      targetHours: rule.targetHours,
      escalationHours: rule.escalationHours,
      notifyRoles: rule.notifyRoles,
      status: rule.status,
    });
    setEditor({ mode: "edit", rule });
  };
  const save = () => {
    if (!form.name || !form.stage) return;
    if (editor?.mode === "edit") {
      void updateSlaRule(editor.rule.id, form);
    } else {
      void createSlaRule({ ...form, name: form.name || "Untitled SLA rule" });
    }
    setEditor(null);
  };

  const rows = useMemo(() => {
    const needle = query.toLowerCase();
    return slaRules.filter((item) =>
      [item.name, item.stage, item.description].join(" ").toLowerCase().includes(needle),
    );
  }, [query, slaRules]);

  const avgTarget =
    slaRules.length === 0
      ? 0
      : Math.round(slaRules.reduce((sum, rule) => sum + rule.targetHours, 0) / slaRules.length);

  const columns: DataColumn<SlaRule>[] = [
    {
      key: "rule",
      header: "SLA rule",
      render: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800">{item.name}</p>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-0.5 max-w-md truncate text-[11px] text-slate-400">{item.description}</p>
        </div>
      ),
    },
    {
      key: "stage",
      header: "Stage",
      render: (item) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          {item.stage}
        </span>
      ),
    },
    {
      key: "target",
      header: "Target / escalation",
      render: (item) => (
        <span className="font-mono text-xs font-semibold">
          {item.targetHours}h / {item.escalationHours}h
        </span>
      ),
    },
    {
      key: "notify",
      header: "Notify",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.notifyRoles.slice(0, 3).map((role) => (
            <span key={role} className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              {role.replace("bank-", "")}
            </span>
          ))}
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
        title="SLA rules"
        description="Service-level commitments per workflow stage with escalation thresholds."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add rule
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="SLA rules" value={String(slaRules.length)} icon={Gauge} tone="navy" />
        <StatCard label="Avg target" value={avgTarget + "h"} icon={Clock3} tone="teal" helper="Mean response window" />
        <StatCard label="Escalation" value="Enabled" icon={Timer} tone="amber" helper="Auto-notify on overrun" />
      </div>
      <Card className="mt-6 overflow-hidden">
        <SearchAndFilterBar query={query} onQueryChange={setQuery} placeholder="Search by rule or stage" />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(item) => item.id}
          empty={<EmptyState title="No SLA rules found" description="No SLA rules match the current filter." />}
        />
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {rows.length} rules · violations surface on bank dashboards and audit logs
        </div>
      </Card>

      <Modal
        open={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.mode === "edit" ? "Edit SLA rule" : "Add SLA rule"}
        description="Prototype service-level rule for the connected demo bank."
        footer={
          <>
            <Button variant="outline" onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button disabled={!form.stage || busyAction !== null} onClick={save}>
              {editor?.mode === "edit" ? "Save changes" : "Create rule"}
            </Button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Rule name" className="sm:col-span-2">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Maker response window"
            />
          </Field>
          <Field label="Workflow stage" required>
            <Select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
            >
              <option>Maker review</option>
              <option>Checker review</option>
              <option>Approver authorization</option>
              <option>Digital signature</option>
              <option>Issuance & notification</option>
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
          <Field label="Target hours">
            <Input
              type="number"
              value={form.targetHours}
              onChange={(e) => setForm({ ...form, targetHours: Number(e.target.value) })}
            />
          </Field>
          <Field label="Escalation hours">
            <Input
              type="number"
              value={form.escalationHours}
              onChange={(e) => setForm({ ...form, escalationHours: Number(e.target.value) })}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description of the commitment"
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}