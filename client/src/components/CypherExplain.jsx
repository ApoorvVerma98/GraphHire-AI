import { useState } from 'react';

export default function CypherExplain({ explain, metadata }) {
  const [open, setOpen] = useState(false);

  if (!explain) return null;

  return (
    <div className="mt-4 border border-indigo-200 bg-indigo-50/60 rounded-xl p-4 text-sm shadow-sm">
      <button 
        onClick={() => setOpen(!open)}
        className="font-semibold text-indigo-800 flex items-center justify-between w-full"
      >
        <span className="flex items-center gap-2">
          ⚡ <strong>Graph Query Explanation</strong> 
          <span className="text-xs bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">
            {metadata?.executionTimeMs}ms
          </span>
        </span>
        <span className="text-xs">{open ? '▲ Hide Cypher' : '▼ View Cypher'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          <p className="text-gray-700 text-xs"><strong>Traversal Summary:</strong> {explain.summary}</p>
          <pre className="bg-gray-900 text-emerald-400 p-3 rounded-lg text-xs overflow-x-auto font-mono">
            {explain.cypher}
          </pre>
        </div>
      )}
    </div>
  );
}
