import { useState } from 'react';
import { getSkillGaps } from '../services/api';
import CypherExplain from './CypherExplain';

export default function SkillGapExplorer() {
  const [candidateId, setCandidateId] = useState('');
  const [gaps, setGaps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!candidateId) return;
    setLoading(true);
    setError(null);
    setGaps(null);
    try {
      const res = await getSkillGaps(candidateId);
      setGaps(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to analyze skill gaps. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Growth intelligence</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Find the next best skill to develop</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Follow a candidate’s known skills to related capabilities through a multi-hop graph traversal.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
        <label htmlFor="candidate-id" className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">Candidate ID</label>
        <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="candidate-id"
          type="number"
          placeholder="Candidate ID (e.g., 1)"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          className="flex-1 border border-gray-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !candidateId}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50 transition text-sm shadow-sm"
        >
          {loading ? 'Traversing Graph...' : 'Explore Gaps'}
        </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl" role="alert">
          {error}
        </div>
      )}

      {gaps && (
        <div className="mt-6 space-y-4">
          <div className="border-t border-slate-100 pt-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Graph recommendations</p><h3 className="mt-1 text-xl font-bold text-slate-900">Recommended next skills</h3></div>
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
