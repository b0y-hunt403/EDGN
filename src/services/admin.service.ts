import { mockMutation } from "@/lib/mock-api";
import type { ManagementDataset } from "@/types";

export const adminService = {
  updateRow(
    dataset: ManagementDataset,
    rowIndex: number,
    status: string,
  ): Promise<ManagementDataset> {
    const rows = dataset.rows.map((row, index) =>
      index === rowIndex ? { ...row, status } : row,
    );
    return mockMutation({ ...dataset, rows }, 380);
  },

  createDemoRecord(label: string): Promise<{ label: string; id: string }> {
    return mockMutation({
      label,
      id: "CFG-DEMO-" + String(Date.now()).slice(-5),
    });
  },
};
