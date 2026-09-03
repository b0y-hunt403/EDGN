import { ApplicantApplicationDetail } from "@/features/applicant/application-detail";

export default async function ApplicantApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ApplicantApplicationDetail applicationId={id} />;
}