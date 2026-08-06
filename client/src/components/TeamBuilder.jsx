import { useState } from "react";
import { buildTeam } from "../services/api";
import CypherExplain from "./CypherExplain";
import GraphVisualizer from "./GraphVisualizer";

const DEFAULT_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "GraphQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "JWT",
  "Neo4j",
  "Tailwind CSS",
];

export default function TeamBuilder() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
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
      setError("Failed to query database. Ensure CognoDB/Backend is online.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-7 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
            Coverage planner
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Recommend a minimal delivery team
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            Select the capabilities your project needs. This feature returns the
            smallest set of candidates whose combined skills cover all selected
            requirements.
          </p>
        </div>
        <span className="w-fit rounded-full bg-[var(--color-teal-50)] px-3 py-1.5 text-xs font-semibold text-[var(--color-teal-700)]">
          Greedy set cover
        </span>
      </div>

      <div className="rounded-xl bg-[var(--color-canvas)] p-4 sm:p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Required skills
        </p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SKILLS.map((skill) => {
            const active = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-[var(--color-teal-600)] text-white"
                    : "bg-white text-[var(--color-ink-soft)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)]"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleBuildTeam}
        disabled={loading || selectedSkills.length === 0}
        className="w-full rounded-xl bg-[var(--color-teal-600)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-teal-700)] disabled:opacity-40 sm:w-auto"
      >
        {loading
          ? "Building coverage recommendation…"
          : "Build recommended team"}
      </button>

      {error && (
        <div
          className="rounded-xl border border-[var(--color-amber-100)] bg-[var(--color-amber-50)] p-4 text-sm text-[var(--color-amber-900)]"
          role="alert"
        >
          {error}
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 border-t border-[var(--color-line)] pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Recommendation
              </p>
              <h3 className="mt-1 text-xl font-semibold">Recommended team</h3>
              {results.allMatches && (
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {results.data.length} candidate(s) recommended from{" "}
                  {results.allMatches.length} matching candidate(s).
                </p>
              )}
            </div>
            <span className="font-data text-sm text-[var(--color-muted)]">
              {results.data.length} selected
            </span>
          </div>

          {results.coverage?.uncoveredSkills?.length > 0 && (
            <div className="rounded-xl border border-[var(--color-amber-100)] bg-[var(--color-amber-50)] p-4 text-sm text-[var(--color-amber-900)]">
              No available candidate covers:{" "}
              {results.coverage.uncoveredSkills.join(", ")}.
            </div>
          )}
          {results.allMatches &&
            results.allMatches.length > results.data.length && (
              <div className="rounded-xl border border-[var(--color-teal-100)] bg-[var(--color-teal-50)]/70 p-4 text-sm text-[var(--color-teal-900)]">
                This recommendation is the smallest team that covers all
                selected skills. {results.allMatches.length} candidate(s) match
                the chosen skills in total, but only {results.data.length} are
                needed to cover them.
              </div>
            )}

          {results.data.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-canvas)] p-6 text-center text-sm text-[var(--color-muted)]">
              No candidates found matching the selected skills.
            </div>
          ) : (
            <div className="grid gap-3">
              {results.data.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-line)] p-4 transition hover:border-[var(--color-teal-100)] sm:p-5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{candidate.name}</h4>
                      {candidate.contributionSkills?.length > 0 && (
                        <span className="rounded-full bg-[var(--color-teal-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-teal-700)]">
                          Covers {candidate.contributionSkills.length} new
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-muted)]">
                      {candidate.role || "Full Stack Engineer"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {candidate.matchingSkills.map((s) => {
                        const isNew = candidate.contributionSkills?.includes(s);
                        return (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-soft)]"
                          >
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{
                                background: isNew
                                  ? "var(--color-teal-600)"
                                  : "var(--color-line-strong)",
                              }}
                              aria-hidden="true"
                            />
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-data text-2xl font-semibold text-[var(--color-teal-700)]">
                      {candidate.contributionSkills?.length || 0}
                    </span>
                    <span className="block text-xs font-medium text-[var(--color-muted)]">
                      New skills
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <GraphVisualizer data={results} type="team" />
          <CypherExplain
            explain={results.explain}
            metadata={results.metadata}
          />
        </div>
      )}
    </div>
  );
}
