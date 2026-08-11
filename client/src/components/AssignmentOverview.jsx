import { useEffect, useState } from "react";
import {
  Users,
  Target,
  Route,
  Network,
  ArrowRight,
  Database,
  GitBranch,
} from "lucide-react";
import { getGraphStats } from "../services/api";

const WORKFLOWS = [
  {
    id: "candidates",
    eyebrow: "01 · CANDIDATE DISCOVERY",
    title: "Find qualified talent",
    description:
      "Search candidates by skills and inspect the capabilities, projects, and companies connected to their profiles.",
    graph: "Candidate → KNOWS → Skill",
    icon: Users,
    action: "Explore candidates",
  },
  {
    id: "team",
    eyebrow: "02 · TEAM BUILDER",
    title: "Build the smallest team",
    description:
      "Select the skills a project needs and find the smallest set of candidates whose combined skills cover those requirements.",
    graph: "Skills ← KNOWS ← Candidates",
    icon: Target,
    action: "Build a team",
  },
  {
    id: "gap",
    eyebrow: "03 · SKILL PATHS",
    title: "Discover skill gaps",
    description:
      "Traverse related skills from a candidate's existing capabilities to identify useful next-step skills.",
    graph: "Skill → RELATED_TO → Skill",
    icon: Route,
    action: "Explore skill paths",
  },
];

export default function AssignmentOverview({ onNavigate }) {
  const [stats, setStats] = useState({
    totalNodes: null,
    totalRelationships: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      try {
        const response = await getGraphStats();

        if (!mounted) return;

        const data = response?.data?.data ?? response?.data ?? {};

        setStats({
          totalNodes: data.totalNodes ?? null,
          totalRelationships: data.totalRelationships ?? null,
        });
      } catch (error) {
        console.error("Failed to load graph stats:", error);
      }
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  const handleNavigate = (id) => {
    onNavigate?.(id);
  };

  return (
    <section className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-teal-100)]">
              <Network
                size={17}
                className="text-[var(--color-teal-700)]"
              />
            </span>

            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-700)]">
              Graph-powered recruiting intelligence
            </p>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
            Discover talent. Build teams. Develop skills.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-ink-soft)]">
            GraphHire connects candidates, skills, projects, companies, and
            certifications so recruiting decisions can be made through
            relationships rather than isolated records.
          </p>
        </div>
      </div>

      {/* Three core workflows */}
      <div>
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Core workflows
          </p>

          <h3 className="mt-1 text-lg font-semibold text-[var(--color-ink)]">
            Three ways the graph solves recruiting problems
          </h3>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {WORKFLOWS.map((workflow) => {
            const Icon = workflow.icon;

            return (
              <article
                key={workflow.id}
                className="group flex min-h-[285px] flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-canvas)]">
                    <Icon
                      size={19}
                      className="text-[var(--color-teal-700)]"
                    />
                  </span>

                  <span className="rounded-full bg-[var(--color-canvas)] px-2.5 py-1 text-[10px] font-semibold text-[var(--color-muted)]">
                    GRAPH WORKFLOW
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-teal-700)]">
                  {workflow.eyebrow}
                </p>

                <h4 className="mt-2 text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                  {workflow.title}
                </h4>

                <p className="mt-2 flex-1 text-sm leading-5 text-[var(--color-ink-soft)]">
                  {workflow.description}
                </p>

                <div className="mt-5 rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <GitBranch
                      size={14}
                      className="shrink-0 text-[var(--color-teal-700)]"
                    />

                    <code className="text-[11px] font-medium text-[var(--color-ink-soft)]">
                      {workflow.graph}
                    </code>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate(workflow.id)}
                  className="mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-[var(--color-teal-700)] transition group-hover:gap-3"
                >
                  {workflow.action}
                  <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Graph data */}
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Database
                size={16}
                className="text-[var(--color-teal-700)]"
              />

              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Graph data
              </p>
            </div>

            <h3 className="mt-1 text-lg font-semibold text-[var(--color-ink)]">
              Connected recruiting knowledge graph
            </h3>

            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              The same graph powers candidate search, team coverage, and skill
              path exploration.
            </p>
          </div>

          <div className="flex gap-3">
            <Stat
              value={stats.totalNodes}
              label="Nodes"
            />

            <Stat
              value={stats.totalRelationships}
              label="Relationships"
            />
          </div>
        </div>

        {/* Simple visual model */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-4 sm:gap-3">
          <GraphEntity label="Candidates" />
          <GraphConnector label="KNOWS" />
          <GraphEntity label="Skills" />
          <GraphConnector label="RELATED_TO" />
          <GraphEntity label="Skills" />
          <GraphConnector label="WORKED_AT" />
          <GraphEntity label="Companies" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="min-w-[90px] rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-4 py-3 text-center">
      <p className="text-xl font-semibold text-[var(--color-ink)]">
        {value ?? "—"}
      </p>

      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  );
}

function GraphEntity({ label }) {
  return (
    <span className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold text-[var(--color-ink)] shadow-sm">
      {label}
    </span>
  );
}

function GraphConnector({ label }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
      → {label} →
    </span>
  );
}