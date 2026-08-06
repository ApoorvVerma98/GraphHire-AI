import { useState } from "react";
import { Database, Route, Target, Users } from "lucide-react";
import TeamBuilder from "./components/TeamBuilder";
import SkillGapExplorer from "./components/SkillGapExplorer";
import GraphDashboard from "./components/GraphDashboard";
import CandidateExplorer from "./components/CandidateExplorer";

export default function App() {
  const [activeTab, setActiveTab] = useState("candidates");
  const tabs = [
    { id: "candidates", label: "Candidates", description: "Browse talent", icon: Users },
    { id: "team", label: "Team Builder", description: "Build coverage", icon: Target },
    { id: "gap", label: "Skill Paths", description: "Explore growth", icon: Route },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-18 min-h-[72px] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
              <Database size={20} strokeWidth={2.4} />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">GraphHire</h1>
              <p className="text-xs text-slate-400">Recruitment intelligence</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            Powered by CognoDB
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-8 sm:px-9 sm:py-10 text-white shadow-xl shadow-slate-300/60">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Graph-powered hiring workspace</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Build capable teams with connected talent data.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Explore candidate capabilities, assemble skill coverage, and surface practical growth paths from your graph.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
              <span className="block text-2xl font-bold text-white">3</span>
              recruiter workflows in one graph
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm h-fit lg:sticky lg:top-6">
            <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
            <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="GraphHire workflows">
              {tabs.map(({ id, label, description, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`min-w-[152px] lg:min-w-0 flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    activeTab === id
                      ? "bg-slate-900 text-white shadow-md shadow-slate-300/60"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} className={activeTab === id ? "text-indigo-300" : "text-slate-400"} />
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className={`block text-xs mt-0.5 ${activeTab === id ? "text-slate-300" : "text-slate-400"}`}>{description}</span>
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-6">
            <GraphDashboard />
            {activeTab === "candidates" && <CandidateExplorer />}
            {activeTab === "team" && <TeamBuilder />}
            {activeTab === "gap" && <SkillGapExplorer />}
          </div>
        </div>
      </main>
    </div>
  );
}
