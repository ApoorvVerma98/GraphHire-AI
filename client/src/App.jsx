import React, { useState } from "react";
import TeamBuilder from "./components/TeamBuilder";
import SkillGapExplorer from "./components/SkillGapExplorer";
import GraphDashboard from "./components/GraphDashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕸️</span>
            <h1 className="text-xl font-bold text-slate-900">GraphHire AI</h1>
          </div>
          <p className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Powered by CognoDB{" "}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <GraphDashboard />
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition ${
              activeTab === "team"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            🎯 Team Builder (Set Coverage)
          </button>
          <button
            onClick={() => setActiveTab("gap")}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition ${
              activeTab === "gap"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            🔍 Skill Gap Explorer (Multi-Hop Traversal)
          </button>
        </div>

        {activeTab === "team" && <TeamBuilder />}
        {activeTab === "gap" && <SkillGapExplorer />}
      </main>
    </div>
  );
}
