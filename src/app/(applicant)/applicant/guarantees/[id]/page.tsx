import { GuaranteeDetail } from "@/features/guarantees/guarantee-detail";

export default async function ApplicantGuaranteeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GuaranteeDetail portal="applicant" guaranteeId={id} />;
}