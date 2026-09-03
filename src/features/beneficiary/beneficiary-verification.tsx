"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, QrCode, Search, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-controls";
import { PageHeader } from "@/components/shared/page-header";
import { publicDemoReference } from "@/mocks/guarantees";

export function BeneficiaryVerification() {
  const [reference, setReference] = useState(publicDemoReference);
  const router = useRouter();
  return (
    <>
      <PageHeader
        eyebrow="Authenticity verification"
        title="Verify a guarantee"
        description="Use an EDGN reference or QR to open the public-safe authenticity record."
      />
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex size-11 items-center justify-center rounded-lg bg-[#eaf5f2] text-[#0f6f68]">
              <Search className="size-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              Enter verification reference
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The public result excludes applicant banking details, collateral, evidence, and internal notes.
            </p>
            <Field label="Verification reference" className="mt-5">
              <Input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                className="font-mono"
              />
            </Field>
            <Button
              className="mt-4 w-full"
              onClick={() => router.push("/verify/" + encodeURIComponent(reference))}
            >
              <ShieldCheck className="size-4" />
              Verify authenticity
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-xl bg-[#173b53] text-white">
              <Camera className="size-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">QR scan demo</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Simulate scanning the QR printed on the signed guarantee.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => router.push("/verify/" + publicDemoReference)}
            >
              <QrCode className="size-4" />
              Scan sample QR
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
