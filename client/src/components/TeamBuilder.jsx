import { useState } from 'react';
import { buildTeam } from '../services/api';
import CypherExplain from './CypherExplain';
import GraphVisualizer from './GraphVisualizer';

const DEFAULT_SKILLS = ['React', 'Node.js', 'Docker', 'Kubernetes', 'TypeScript', 'Python', 'GraphQL'];

export default function TeamBuilder() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleBuildTeam = async () => {
    if (selectedSkills.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await buildTeam(selectedSkills);
      setResults(res.data);
    } catch (err) {
      setError('Failed to query database. Ensure CognoDB/Backend is online.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">Coverage planner</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Build a balanced delivery team</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Select the capabilities your project needs. The graph recommends the smallest team that covers the most remaining skills at each step.</p>
        </div>
        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">Greedy set cover</span>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Required skills</p>
        <div className="flex flex-wrap gap-2">
        {DEFAULT_SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedSkills.includes(skill)
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {selectedSkills.includes(skill) ? `✓ ${skill}` : `+ ${skill}`}
          </button>
        ))}
        </div>
      </div>

      <button
        onClick={handleBuildTeam}
        disabled={loading || selectedSkills.length === 0}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl disabled:opacity-50 transition shadow-sm shadow-indigo-200"
      >
        {loading ? 'Building coverage recommendation...' : 'Build Recommended Team'}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-4">
          <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-6">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Recommendation</p><h3 className="mt-1 text-xl font-bold text-slate-900">Recommended team</h3></div>
            <span className="text-sm text-slate-500">{results.data.length} selected</span>
          </div>

          {results.coverage?.uncoveredSkills?.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
              No available candidate covers: {results.coverage.uncoveredSkills.join(', ')}.
            </div>
          )}

          {results.data.length === 0 ? (
            <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-sm text-gray-500">No candidates found matching the selected skills.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {results.data.map((candidate) => (
                <div key={candidate.id} className="p-4 sm:p-5 border border-slate-200 rounded-xl flex justify-between items-center hover:border-indigo-300 hover:shadow-sm transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{candidate.name}</h4>
                      {candidate.contributionSkills?.length > 0 && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Covers {candidate.contributionSkills.length} new
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{candidate.role || 'Full Stack Engineer'}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.matchingSkills.map((s) => (
                        <span key={s} className={`border text-xs px-2 py-0.5 rounded-md font-medium ${candidate.contributionSkills?.includes(s) ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600">{candidate.contributionSkills?.length || 0}</span>
                    <span className="text-xs text-gray-400 block font-medium">New skills</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <GraphVisualizer data={results} type="team" />
          <CypherExplain explain={results.explain} metadata={results.metadata} />
        </div>
      )}
    </div>
  );
}
