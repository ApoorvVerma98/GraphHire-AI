import { useState } from "react";
import { getSkillGaps } from "../services/api";
import CypherExplain from "./CypherExplain";

export default function SkillGapExplorer() {
  const [candidateId, setCandidateId] = useState("");
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
      setGaps({
        data: res.data.data,
        stats: res.data.stats,
        explain: res.data.explain,
        metadata: res.data.metadata,
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to analyze skill gaps. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-7 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-amber-600)]">
          Growth intelligence
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Find the next best skill to develop
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Follows a candidate's known skills to related capabilities through a
          multi-hop graph traversal.
        </p>
      </div>

      <div className="rounded-xl bg-[var(--color-canvas)] p-4 sm:p-5">
        <label
          htmlFor="candidate-id"
          className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]"
        >
          Candidate ID
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="candidate-id"
            type="number"
            placeholder="e.g. 1"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            className="font-data flex-1 rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm focus:border-[var(--color-amber-600)] focus:outline-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !candidateId}
            className="rounded-xl bg-[var(--color-amber-600)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-amber-700)] disabled:opacity-40"
          >
            {loading ? "Traversing graph…" : "Explore gaps"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl border border-[var(--color-amber-100)] bg-[var(--color-amber-50)] p-4 text-sm text-[var(--color-amber-900)]"
          role="alert"
        >
          {error}
        </div>
      )}

      {gaps && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Candidate known skills
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {gaps.stats?.knownSkills?.length > 0 ? (
                  gaps.stats.knownSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--color-ink-soft)] shadow-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[var(--color-muted)]">
                    No known skills found for this candidate.
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Related skills reachable
              </p>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                These are skills connected by `RELATED_TO` edges from the
                candidate’s known skills.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {gaps.relatedSkills?.length > 0 ? (
                  gaps.relatedSkills.map((skill) => (
                    <span
                      key={skill.related}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--color-ink-soft)] shadow-sm"
                    >
                      {skill.related}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[var(--color-muted)]">
                    No related skills modeled for this candidate.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-line)] pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Graph recommendations
            </p>
            <h3 className="mt-1 text-xl font-semibold">
              Recommended next skills
            </h3>
          </div>

          {gaps.data.length === 0 ? (
            <div className="space-y-2 rounded-xl border border-[var(--color-amber-100)] bg-[var(--color-amber-50)]/40 p-4">
              <p className="text-sm text-[var(--color-muted)]">
                No skill gaps found for candidate {candidateId}.
              </p>
              {gaps.stats?.relatedSkillCount === 0 ? (
                <p className="text-sm text-[var(--color-ink-soft)]">
                  The candidate does not currently have any connected next-step
                  skills in the seeded `RELATED_TO` graph.
                </p>
              ) : (
                <p className="text-sm text-[var(--color-ink-soft)]">
                  The candidate already knows all related next-step skills
                  currently modeled in the graph for their existing skill set.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {gaps.data.map((gap, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[var(--color-amber-100)] bg-[var(--color-amber-50)]/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--color-amber-900)]">
                      {gap.missingSkill}
                    </span>
                    <span className="rounded-md bg-[var(--color-amber-100)] px-2 py-0.5 text-xs font-medium text-[var(--color-amber-900)]">
                      Recommended upgrade
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
                    <strong className="font-semibold">
                      Prerequisites currently known:
                    </strong>{" "}
                    {gap.prerequisites.join(", ")}
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
