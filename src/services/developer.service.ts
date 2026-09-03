import { mockMutation } from "@/lib/mock-api";
import type { ApiClient, WebhookDelivery } from "@/types";

export interface ExplorerResponse {
  status: number;
  duration: number;
  requestId: string;
  body: Record<string, unknown>;
}

export const developerService = {
  createClient(name: string): Promise<{ client: ApiClient; secret: string }> {
    return mockMutation({
      client: {
        id: "cli_aacra_sbx_92m7",
        name,
        organization: "Addis Ababa City Roads Authority",
        environment: "Sandbox" as const,
        status: "Active" as const,
        requests: "0 this month",
        lastUsed: "Never",
        scopes: ["guarantees:verify"],
      },
      secret: "edgn_sbx_92m7_Kx4n8Qv2Bp6jR1wZ",
    }, 650);
  },

  runExplorer(path: string): Promise<ExplorerResponse> {
    return mockMutation({
      status: 200,
      duration: 184,
      requestId: "req_01J7EDGN8Z4X2M1P",
      body: {
        reference: path.includes("EDGN-") ? path.split("/").at(-1) : "EDGN-V-2026-004871",
        authentic: true,
        status: "ACTIVE",
        issuer: "Commercial Bank of Ethiopia",
        guaranteeType: "Performance Guarantee",
        issuedAt: "2026-02-12",
        expiresAt: "2027-02-11",
        registryVersion: 2,
      },
    }, 720);
  },

  replayWebhook(delivery: WebhookDelivery): Promise<WebhookDelivery> {
    return mockMutation({ ...delivery, status: "Delivered", responseCode: 204, attempts: delivery.attempts + 1 });
  },

  rotateSecret(): Promise<{ secret: string }> {
    return mockMutation({ secret: "edgn_sbx_rotated_7Mt2Kp9Rx4Vz" });
  },
};
