"use client";

import { guarantees } from "@/mocks/guarantees";
import type { Guarantee } from "@/types";

export interface VerificationResult {
  found: boolean;
  guarantee?: {
    reference: string;
    verificationReference: string;
    type: string;
    bank: string;
    amount: number;
    currency: string;
    issueDate: string;
    expiryDate: string;
    status: string;
  };
  verifiedAt: string;
}

function delay<T>(data: T, ms = 900): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

function matchesQuery(g: Guarantee, q: string): boolean {
  const haystack = [
    g.reference,
    g.verificationReference,
    g.id,
    g.bankGuaranteeNumber,
  ]
    .map((s) => s.toUpperCase())
    .join("|");
  return haystack.includes(q);
}

export function useVerificationService() {
  return {
    verify: async (input: string): Promise<VerificationResult> => {
      const q = input.trim().toUpperCase();
      const match = guarantees.find((g) => matchesQuery(g, q));
      const found = Boolean(match);
      const result: VerificationResult = {
        found,
        verifiedAt: new Date().toISOString(),
      };
      if (match) {
        result.guarantee = {
          reference: match.reference,
          verificationReference: match.verificationReference,
          type: match.type,
          bank: match.bank,
          amount: match.amount,
          currency: match.currency,
          issueDate: match.issueDate,
          expiryDate: match.expiryDate,
          status: match.status,
        };
      }
      return delay(result);
    },
  };
}