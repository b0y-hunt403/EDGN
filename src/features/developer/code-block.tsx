"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/store/demo-store";

export function CodeBlock({ code, language = "bash", compact = false }: { code: string; language?: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useDemo();
  const copy = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    addToast("Code copied", "The example is ready to paste into your sandbox project.", "info");
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-[#111b24] text-slate-200">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{language}</span>
        <button type="button" onClick={() => void copy()} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white">
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={(compact ? "max-h-56" : "max-h-96") + " overflow-auto p-4 font-mono text-[12px] leading-6"}><code>{code}</code></pre>
    </div>
  );
}
