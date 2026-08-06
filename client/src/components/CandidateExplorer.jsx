import { useEffect, useState } from "react";
import {
  getAllCandidates,
  getCandidateById,
  searchCandidates,
} from "../services/api";

export default function CandidateExplorer() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      setIsModalOpen(false);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "Candidates are temporarily unavailable. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getAllCandidates()
      .then((response) => {
        if (!cancelled) setCandidates(response.data.data);
      })
      .catch((requestError) => {
        console.error(requestError);
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Candidates are temporarily unavailable. Please try again shortly.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const viewCandidate = async (id) => {
    setError(null);
    try {
      const response = await getCandidateById(id);
      setSelectedCandidate(response.data.data);
      setIsModalOpen(true);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "Candidate details are temporarily unavailable. Please try again shortly.",
      );
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-7 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Talent directory
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Explore connected candidate profiles
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Search by candidate name or skill, then inspect their projects and
          capabilities.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 rounded-xl bg-[var(--color-canvas)] p-4 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          loadCandidates(query);
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or skill"
          className="flex-1 rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm focus:border-[var(--color-teal-600)] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-teal-600)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-teal-700)]"
        >
          Search
        </button>
      </form>

      {error && (
        <div
          className="rounded-xl border border-[var(--color-amber-100)] bg-[var(--color-amber-50)] p-4 text-sm text-[var(--color-amber-900)]"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[var(--color-muted)]" role="status">
          Loading candidates…
        </p>
      ) : candidates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-canvas)] p-6 text-center text-sm text-[var(--color-muted)]">
          No candidates match this search.
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => viewCandidate(candidate.id)}
              className="rounded-xl border border-[var(--color-line)] p-4 text-left transition hover:border-[var(--color-teal-100)] hover:bg-[var(--color-teal-50)]/40"
            >
              <h3 className="font-semibold">{candidate.name}</h3>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {candidate.role}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[var(--color-line)] px-2 py-0.5 text-xs font-medium text-[var(--color-ink-soft)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {isModalOpen && selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Candidate profile
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-teal-900)]">
                  {selectedCandidate.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-teal-700)]">
                  {selectedCandidate.role}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:bg-[var(--color-teal-50)]"
                aria-label="Close profile modal"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-[var(--color-ink-soft)]">
              <p>
                <strong className="font-semibold">Projects:</strong>{" "}
                {selectedCandidate.projects.join(", ") || "No projects listed"}
              </p>
              <p>
                <strong className="font-semibold">Skills:</strong>{" "}
                {selectedCandidate.skills.join(", ") || "No skills listed"}
              </p>
              {selectedCandidate.summary && (
                <p>
                  <strong className="font-semibold">Summary:</strong>{" "}
                  {selectedCandidate.summary}
                </p>
              )}
              {selectedCandidate.location && (
                <p>
                  <strong className="font-semibold">Location:</strong>{" "}
                  {selectedCandidate.location}
                </p>
              )}
              {selectedCandidate.experience && (
                <p>
                  <strong className="font-semibold">Experience:</strong>{" "}
                  {selectedCandidate.experience}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
