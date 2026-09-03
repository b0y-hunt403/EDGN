"use client";

import { useMemo, useState } from "react";
import { Check, Edit3, Plus, Power, Save, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DataTable, type DataColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { DetailDrawer } from "@/components/shared/detail-drawer";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/shared/states";
import { adminDatasets } from "@/mocks/management";
import { adminService } from "@/services/admin.service";
import { useDemo } from "@/store/demo-store";
import type { ManagementCell, ManagementDataset } from "@/types";

type ManagementRow = Record<string, ManagementCell>;

export function ManagementPage({ datasetKey }: { datasetKey: string }) {
  const source = adminDatasets[datasetKey] ?? adminDatasets.organizations;
  const [dataset, setDataset] = useState<ManagementDataset>(source);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ManagementRow | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [createOpen, setCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const { addToast } = useDemo();

  const rows = useMemo(
    () =>
      dataset.rows.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [dataset.rows, query],
  );

  const columns: DataColumn<ManagementRow>[] = dataset.columns.map((column) => ({
    key: column.key,
    header: column.label,
    render: (row) => {
      const value = row[column.key];
      if (column.key === "status" || column.key === "severity" || column.key === "mfa") {
        return <StatusBadge status={String(value)} label={String(value)} />;
      }
      return (
        <span
          className={
            column === dataset.columns[0]
              ? "font-semibold text-slate-800"
              : "text-slate-600"
          }
        >
          {String(value)}
        </span>
      );
    },
  }));

  const updateStatus = async () => {
    if (selectedIndex < 0 || !selected) return;
    const current = String(selected.status ?? "");
    const nextStatus =
      current === "Disabled" || current === "Suspended" ? "Active" : "Disabled";
    const updated = await adminService.updateRow(dataset, selectedIndex, nextStatus);
    setDataset(updated);
    setSelected(updated.rows[selectedIndex]);
    addToast(
      "Configuration updated",
      String(selected[dataset.columns[0].key]) + " is now " + nextStatus.toLowerCase() + ".",
      nextStatus === "Disabled" ? "warning" : "success",
    );
  };

  return (
    <>
      <PageHeader
        eyebrow={dataset.eyebrow}
        title={dataset.title}
        description={dataset.description}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            {dataset.primaryAction}
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          placeholder={"Search " + dataset.title.toLowerCase()}
        />
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(row) => String(row[dataset.columns[0].key])}
          onRowClick={(row) => {
            setSelected(row);
            setSelectedIndex(dataset.rows.indexOf(row));
          }}
          empty={<EmptyState />}
        />
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {rows.length} configuration records · changes are local
        </div>
      </Card>

      <DetailDrawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? String(selected[dataset.columns[0].key]) : ""}
        description={"Configuration details · " + dataset.title}
        footer={
          <>
            <Button variant="outline" onClick={() => addToast("Edit mode enabled", "Fields are editable in this frontend simulation.", "info")}>
              <Edit3 className="size-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => void updateStatus()}>
              <Power className="size-4" />
              {String(selected?.status) === "Disabled" ? "Enable" : "Disable"}
            </Button>
            <Button onClick={() => addToast("Change approved", "The simulated four-eyes approval was recorded.")}>
              <Check className="size-4" />
              Approve
            </Button>
          </>
        }
      >
        <dl className="space-y-4">
          {selected
            ? Object.entries(selected).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-slate-200 p-4">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {key.replaceAll("-", " ").replaceAll("_", " ")}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-slate-800">
                    {String(value)}
                  </dd>
                </div>
              ))
            : null}
          <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 text-xs leading-5 text-blue-800">
            Sensitive changes require step-up authentication and a second approver in the production design.
          </div>
        </dl>
      </DetailDrawer>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={dataset.primaryAction}
        description="Create a realistic demonstration record without a backend."
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                void adminService.createDemoRecord(newLabel || dataset.primaryAction).then((record) => {
                  addToast("Record created", record.label + " · " + record.id);
                  setCreateOpen(false);
                  setNewLabel("");
                });
              }}
            >
              <Save className="size-4" />
              Save record
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">
            Name / label
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={newLabel}
              onChange={(event) => setNewLabel(event.target.value)}
              placeholder="Enter a descriptive record name"
              className="pl-9"
            />
          </div>
        </label>
        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-xs leading-5 text-slate-600">
          Additional fields would be driven by the selected configuration schema. This demo focuses on interaction and governance.
        </div>
      </Modal>
    </>
  );
}
