import { useEffect, useState } from "react";
import {
  getAllCandidates,
  getCandidateById,
  searchCandidates,
} from "../services/api";

export default function CandidateExplorer() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCandidates = async (searchQuery = "") => {
    setLoading(true);
    setError(null);

    try {
      const response = searchQuery.trim()
        ? await searchCandidates(searchQuery.trim())
        : await getAllCandidates();
      setCandidates(response.data.data);
      setSelectedCandidate(null);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "Candidates are temporarily unavailable. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getAllCandidates()
      .then((response) => {
        if (!cancelled) {
          setCandidates(response.data.data);
        }
      })
      .catch((requestError) => {
        console.error(requestError);
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Candidates are temporarily unavailable. Please try again shortly."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const viewCandidate = async (id) => {
    setError(null);
    try {
      const response = await getCandidateById(id);
      setSelectedCandidate(response.data.data);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "Candidate details are temporarily unavailable. Please try again shortly."
      );
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Talent directory</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Explore connected candidate profiles</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Search by candidate name or skill, then inspect their projects and capabilities.
        </p>
      </div>

      <form
        className="flex flex-col sm:flex-row gap-3 rounded-2xl bg-slate-50 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          loadCandidates(query);
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or skill"
          className="flex-1 border border-gray-200 bg-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl text-sm"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500" role="status">Loading candidates…</p>
      ) : candidates.length === 0 ? (
        <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500">
          No candidates match this search.
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-3">
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => viewCandidate(candidate.id)}
              className="text-left p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-sm transition"
            >
              <h3 className="font-bold text-gray-900">{candidate.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{candidate.role}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedCandidate && (
        <aside className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-5">
          <h3 className="font-bold text-indigo-950">{selectedCandidate.name}</h3>
          <p className="text-sm text-indigo-800 mt-1">{selectedCandidate.role}</p>
          <p className="text-xs text-gray-600 mt-3">
            <strong>Projects:</strong> {selectedCandidate.projects.join(", ") || "No projects listed"}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            <strong>Skills:</strong> {selectedCandidate.skills.join(", ") || "No skills listed"}
          </p>
        </aside>
      )}
    </section>
  );
}
