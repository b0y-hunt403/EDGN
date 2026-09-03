import { mockMutation } from "@/lib/mock-api";
import type {
  Application,
  ApplicationStatus,
  NewGuaranteeDraft,
} from "@/types";

export const applicationService = {
  saveDraft(
    application: Application,
    draft: NewGuaranteeDraft,
  ): Promise<Application> {
    return mockMutation({
      ...application,
      applicant: draft.applicant,
      beneficiary: draft.beneficiary,
      bankId: draft.bankId,
      type: draft.type,
      amount: Number(draft.amount.replaceAll(",", "")),
      contractReference: draft.contractReference,
      contractTitle: draft.contractTitle,
      tenderValue: Number(draft.tenderValue.replaceAll(",", "")),
      effectiveDate: draft.effectiveDate,
      expiryDate: draft.expiryDate,
      status: "DRAFT" as const,
      submittedAt: "Draft saved just now",
    });
  },

  submit(
    application: Application,
    draft: NewGuaranteeDraft,
  ): Promise<Application> {
    return mockMutation(
      {
        ...application,
        applicant: draft.applicant,
        beneficiary: draft.beneficiary,
        bankId: draft.bankId,
        type: draft.type,
        amount: Number(draft.amount.replaceAll(",", "")),
        contractReference: draft.contractReference,
        contractTitle: draft.contractTitle,
        tenderValue: Number(draft.tenderValue.replaceAll(",", "")),
        effectiveDate: draft.effectiveDate,
        expiryDate: draft.expiryDate,
        status: "SUBMITTED" as const,
        submittedAt: "01 Sep 2026, just now",
        sla: "08h 00m remaining",
        assignee: "CBE Guarantee Operations",
      },
      760,
    );
  },

  transition(
    application: Application,
    status: ApplicationStatus,
    assignee: string,
  ): Promise<Application> {
    return mockMutation(
      {
        ...application,
        status,
        assignee,
        sla:
          status === "ISSUED"
            ? "Completed"
            : status === "MORE_INFORMATION_REQUIRED"
              ? "Paused · applicant response"
              : application.sla,
      },
      640,
    );
  },
};
