import React, { useState } from 'react';
import { getSkillGaps } from '../services/api';
import CypherExplain from './CypherExplain';

export default function SkillGapExplorer() {
  const [candidateId, setCandidateId] = useState('');
  const [gaps, setGaps] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!candidateId) return;
    setLoading(true);
    try {
      const res = await getSkillGaps(candidateId);
      setGaps(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">🔍 Skill Gap Explorer (Multi-Hop Traversal)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Executes multi-hop traversal: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-indigo-600">(Candidate)-[:KNOWS]-&gt;(Skill)-[:RELATED_TO]-&gt;(Skill)</code>
        </p>
      </div>

      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Candidate ID (e.g., 1)"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          className="flex-1 border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !candidateId}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl disabled:opacity-50 transition text-sm shadow-sm"
        >
          {loading ? 'Traversing Graph...' : 'Explore Gaps'}
        </button>
      </div>

      {gaps && (
        <div className="mt-6 space-y-4">
          <h3 className="text-md font-bold text-gray-800">Recommended Next-Level Skills</h3>
          {gaps.data.length === 0 ? (
            <p className="text-gray-500 text-sm">No skill gaps found for candidate {candidateId}.</p>
          ) : (
            <div className="grid gap-3">
              {gaps.data.map((gap, idx) => (
                <div key={idx} className="p-4 border border-emerald-200 bg-emerald-50/40 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900 text-sm">{gap.missingSkill}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-medium">Recommended Upgrade</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Prerequisites Currently Known:</strong> {gap.prerequisites.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}

          <CypherExplain explain={gaps.explain} metadata={gaps.metadata} />
        </div>
      )}
    </div>
  );
}