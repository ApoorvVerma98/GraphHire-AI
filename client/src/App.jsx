import { useState } from "react";
import { Route, Target, Users, Workflow } from "lucide-react";
import TeamBuilder from "./components/TeamBuilder";
import SkillGapExplorer from "./components/SkillGapExplorer";
import GraphDashboard from "./components/GraphDashboard";
import CandidateExplorer from "./components/CandidateExplorer";

const NAV = [
  { id: "candidates", label: "Candidates", description: "Browse talent", icon: Users },
  { id: "team", label: "Team Builder", description: "Build coverage", icon: Target },
  { id: "gap", label: "Skill Paths", description: "Explore growth", icon: Route },
];

// Three-node mark: stands in for the graph itself rather than a generic
// database/briefcase icon. Two "candidate" nodes connect through one
// "skill" node - the exact shape Team Builder and Skill Gap both traverse.
function GraphMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="5" y1="6" x2="12" y2="18" stroke="var(--color-teal-100)" strokeWidth="1.6" />
      <line x1="19" y1="6" x2="12" y2="18" stroke="var(--color-teal-100)" strokeWidth="1.6" />
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
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between rounded-2xl bg-[var(--color-ink)] px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-teal-700)]">
              <GraphMark />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">GraphHire</h1>
              <p className="font-data text-[11px] text-white/45">recruiting graph · CognoDB</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Workflow size={14} className="text-[var(--color-teal-100)]" />
            <span className="text-xs font-medium text-white/70">3 connected workflows</span>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3 lg:sticky lg:top-6">
            <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Workspace
            </p>
            <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="GraphHire workflows">
              {NAV.map(({ id, label, description, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-w-[152px] items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:min-w-0 ${
                      active
                        ? "bg-[var(--color-ink)] text-white"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-canvas)]"
                    }`}
                  >
                    <Icon size={18} className={active ? "text-[var(--color-teal-100)]" : "text-[var(--color-muted)]"} />
                    <span>
                      <span className="block text-sm font-medium">{label}</span>
                      <span className={`block text-xs mt-0.5 ${active ? "text-white/55" : "text-[var(--color-muted)]"}`}>
                        {description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
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
