import { VerifyResult } from "@/features/verification/verify-result";

export default async function VerificationResultPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  return <VerifyResult reference={reference} />;
}
