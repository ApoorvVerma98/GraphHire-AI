import { useState } from "react";
import { Route, Target, Users, Workflow } from "lucide-react";
import TeamBuilder from "./components/TeamBuilder";
import SkillGapExplorer from "./components/SkillGapExplorer";
import GraphDashboard from "./components/GraphDashboard";
import CandidateExplorer from "./components/CandidateExplorer";

const NAV = [
  {
    id: "candidates",
    label: "Candidates",
    description: "Browse talent",
    icon: Users,
  },
  {
    id: "team",
    label: "Team Builder",
    description: "Build coverage",
    icon: Target,
  },
  {
    id: "gap",
    label: "Skill Paths",
    description: "Explore growth",
    icon: Route,
  },
];

// Three-node mark: stands in for the graph itself rather than a generic
// database/briefcase icon. Two "candidate" nodes connect through one
// "skill" node - the exact shape Team Builder and Skill Gap both traverse.
function GraphMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="5"
        y1="6"
        x2="12"
        y2="18"
        stroke="var(--color-teal-100)"
        strokeWidth="1.6"
      />
      <line
        x1="19"
        y1="6"
        x2="12"
        y2="18"
        stroke="var(--color-teal-100)"
        strokeWidth="1.6"
      />
      <circle cx="5" cy="6" r="3" fill="var(--color-teal-100)" />
      <circle cx="19" cy="6" r="3" fill="var(--color-teal-100)" />
      <circle cx="12" cy="18" r="3.4" fill="var(--color-amber-100)" />
    </svg>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("candidates");

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] font-[var(--font-body)] text-[var(--color-ink)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto  flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-teal-700)]">
              <GraphMark />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                GraphHire
              </h1>
              <p className="font-data text-[11px] text-[var(--color-muted)]">
                recruiting graph · CognoDB
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 pl-10 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-2">
              {NAV.map(({ id, label }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[var(--color-teal-700)] text-white"
                        : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-soft)] hover:bg-[var(--color-canvas)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Workflow size={14} className="text-[var(--color-teal-700)]" />
              <span className="text-xs font-medium text-[var(--color-muted)]">
                3 connected workflows
              </span>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-32 sm:pb-8">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3 lg:sticky lg:top-6">
            <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Workspace summary
            </p>
            <div className="space-y-3 px-3 py-2">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Current workflow
                </p>
                <p className="mt-2 font-semibold text-[var(--color-ink)]">
                  {NAV.find((item) => item.id === activeTab)?.label}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Description
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                  {NAV.find((item) => item.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <GraphDashboard />
            {activeTab === "candidates" && <CandidateExplorer />}
            {activeTab === "team" && <TeamBuilder />}
            {activeTab === "gap" && <SkillGapExplorer />}
          </div>
        </div>
      </div>
    </div>
  );
}
