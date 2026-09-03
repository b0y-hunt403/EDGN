import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { WorkspaceRouter } from "@/features/workspace/workspace-router";
import type { PortalId } from "@/types";

const portals: PortalId[] = ["applicant", "beneficiary", "bank", "admin", "court", "developer"];

export default async function PortalWorkspacePage({ params }: { params: Promise<{ portal: string; slug?: string[] }> }) {
  const { portal, slug = [] } = await params;
  if (!portals.includes(portal as PortalId)) notFound();
  return <AppShell><WorkspaceRouter portal={portal as PortalId} slug={slug} /></AppShell>;
}
