import { ClaimDetail } from "@/features/claims/claim-detail";

export default async function ApplicantClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClaimDetail claimId={id} />;
}
