import { mockMutation } from "@/lib/mock-api";

export const courtService = {
  createInformationRequest(): Promise<{ id: string; dueDate: string }> {
    return mockMutation({
      id: "CIR-2026-00419",
      dueDate: "04 Sep 2026",
    });
  },

  scheduleHearing(): Promise<{ id: string; date: string }> {
    return mockMutation({
      id: "HRG-2026-00182",
      date: "08 Sep 2026, 09:30",
    });
  },

  saveDecisionDraft(): Promise<{ id: string; status: string }> {
    return mockMutation({
      id: "DEC-DRAFT-2026-00128",
      status: "Draft saved · not issued",
    });
  },
};
