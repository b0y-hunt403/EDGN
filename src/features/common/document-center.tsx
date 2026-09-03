"use client";

import { useMemo, useState } from "react";
import { Archive, FileCheck2, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SearchAndFilterBar } from "@/components/shared/search-filter-bar";
import { DocumentCard } from "@/components/shared/document-card";
import { EmptyState } from "@/components/shared/states";
import { useDemo } from "@/store/demo-store";

export function DocumentCenter() {
  const { guarantees, currentUser, addToast } = useDemo();
  const [query, setQuery] = useState("");
  const documents = useMemo(
    () =>
      guarantees
        .filter(
          (item) =>
            item.applicant === currentUser.organization ||
            item.beneficiary === currentUser.organization,
        )
        .flatMap((item) =>
          item.documents.map((document) => ({
            ...document,
            reference: item.reference,
          })),
        )
        .filter((item) =>
          [item.name, item.category, item.reference]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
    [currentUser.organization, guarantees, query],
  );

  return (
    <>
      <PageHeader
        eyebrow="Secure document repository"
        title="Document center"
        description="Application, contract, signed guarantee, and approval documents."
        actions={
          <Button
            onClick={() =>
              addToast(
                "Upload ready",
                "Choose a related workflow before uploading in the production system.",
                "info",
              )
            }
          >
            <Upload className="size-4" />
            Upload document
          </Button>
        }
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        {[
          ["Authorized files", "12", Archive],
          ["Integrity verified", "11", FileCheck2],
          ["Signed records", "3", FileCheck2],
        ].map(([label, value, Icon]) => {
          const IconComponent = Icon as typeof Archive;
          return (
            <Card key={String(label)} className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-[#0f6f68]">
                <IconComponent className="size-5" />
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-950">{String(value)}</p>
                <p className="text-xs text-slate-500">{String(label)}</p>
              </div>
            </Card>
          );
        })}
      </div>
      <Card className="overflow-hidden">
        <SearchAndFilterBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search file name, category, or guarantee reference"
        />
        {documents.length ? (
          documents.map((document) => (
            <div key={document.id + document.reference}>
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 font-mono text-[10px] font-semibold text-slate-500">
                {document.reference}
              </div>
              <DocumentCard
                document={document}
                onDownload={() =>
                  addToast(
                    "Document ready",
                    document.name + " was opened in demo mode.",
                    "info",
                  )
                }
              />
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </Card>
    </>
  );
}
