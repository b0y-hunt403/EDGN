import { mockApi, mockMutation } from "@/lib/mock-api";
import { guarantees } from "@/mocks/guarantees";
import type { Guarantee } from "@/types";

export const guaranteeService = {
  list(): Promise<Guarantee[]> {
    return mockApi(guarantees);
  },

  getByReference(reference: string): Promise<Guarantee | null> {
    const normalized = reference.trim().toUpperCase();
    const guarantee =
      guarantees.find(
        (item) =>
          item.reference.toUpperCase() === normalized ||
          item.verificationReference.toUpperCase() === normalized,
      ) ?? null;
    return mockApi(guarantee, { delay: 520 });
  },

  verify(
    collection: Guarantee[],
    reference: string,
  ): Promise<Guarantee | null> {
    const normalized = reference.trim().toUpperCase();
    const guarantee =
      collection.find(
        (item) =>
          item.reference.toUpperCase() === normalized ||
          item.verificationReference.toUpperCase() === normalized,
      ) ?? null;
    return mockApi(guarantee, { delay: 780 });
  },

  saveLifecycleRequest(label: string): Promise<{ reference: string }> {
    return mockMutation({
      reference: label.toUpperCase().slice(0, 3) + "-2026-00128",
    });
  },
};
