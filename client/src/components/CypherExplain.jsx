import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CypherExplain({ explain, metadata }) {
  const [open, setOpen] = useState(false);

  if (!explain) return null;

  return (
    <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-4 text-sm">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between font-semibold text-[var(--color-ink-soft)]">
        <span className="flex items-center gap-2">
          <strong className="font-semibold">Graph query explanation</strong>
          <span className="font-data rounded-full bg-[var(--color-teal-50)] px-2 py-0.5 text-xs text-[var(--color-teal-700)]">
            {metadata?.executionTimeMs}ms
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
          {open ? "Hide Cypher" : "View Cypher"}
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-[var(--color-ink-soft)]">
            <strong className="font-semibold">Traversal summary:</strong> {explain.summary}
          </p>
          <pre className="font-data overflow-x-auto rounded-lg bg-[var(--color-ink)] p-3 text-xs text-[var(--color-teal-100)]">
            {explain.cypher}
          </pre>
        </div>
      )}
    </div>
  );
}
