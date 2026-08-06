import React, { useState } from 'react';
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
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">🎯 Team Builder (Set-Cover Analysis)</h2>
        <p className="text-sm text-gray-500 mt-1">Select project skills to find optimal candidates with maximum skill coverage.</p>
      </div>

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

      <button
        onClick={handleBuildTeam}
        disabled={loading || selectedSkills.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50 transition shadow-sm"
      >
        {loading ? 'Evaluating Set-Cover Graph Query...' : 'Calculate Optimal Candidates'}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-4">
          <h3 className="text-md font-bold text-gray-800">Matched Candidates</h3>

          {results.data.length === 0 ? (
            <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-sm text-gray-500">No candidates found matching the selected skills.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {results.data.map((candidate) => (
                <div key={candidate.id} className="p-4 border rounded-xl flex justify-between items-center hover:border-indigo-300 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{candidate.name}</h4>
                      {candidate.skillMatchCount === selectedSkills.length && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          100% Match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{candidate.role || 'Full Stack Engineer'}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.matchingSkills.map((s) => (
                        <span key={s} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600">{candidate.skillMatchCount}</span>
                    <span className="text-xs text-gray-400 block font-medium">Matches</span>
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