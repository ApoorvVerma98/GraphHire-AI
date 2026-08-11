import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Network,
  Route,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";

import TeamBuilder from "./components/TeamBuilder";
import SkillGapExplorer from "./components/SkillGapExplorer";
import GraphDashboard from "./components/GraphDashboard";
import CandidateExplorer from "./components/CandidateExplorer";

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Graph intelligence overview",
    icon: Network,
  },
  {
    id: "candidates",
    label: "Candidates",
    description: "Find connected talent",
    icon: Users,
  },
  {
    id: "team",
    label: "Team Builder",
    description: "Build minimum coverage",
    icon: Target,
  },
  {
    id: "gap",
    label: "Skill Paths",
    description: "Discover skill growth",
    icon: Route,
  },
];

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

/* ---------------------------------------------------------
   Animated graph visual used on the landing dashboard
--------------------------------------------------------- */

function NetworkVisual() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-[#101417]">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 700 360"
        preserveAspectRatio="none"
      >
        <line
          x1="350"
          y1="180"
          x2="150"
          y2="80"
          stroke="#58736d"
          strokeWidth="1.5"
        />

        <line
          x1="350"
          y1="180"
          x2="550"
          y2="80"
          stroke="#58736d"
          strokeWidth="1.5"
        />

        <line
          x1="350"
          y1="180"
          x2="150"
          y2="280"
          stroke="#58736d"
          strokeWidth="1.5"
        />

        <line
          x1="350"
          y1="180"
          x2="550"
          y2="280"
          stroke="#58736d"
          strokeWidth="1.5"
        />

        <line
          x1="150"
          y1="80"
          x2="550"
          y2="80"
          stroke="#384943"
          strokeWidth="1"
          strokeDasharray="5 7"
        />

        <line
          x1="150"
          y1="280"
          x2="550"
          y2="280"
          stroke="#384943"
          strokeWidth="1"
          strokeDasharray="5 7"
        />
      </svg>

      {/* Center node */}
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-[30px] border border-teal-300/20 bg-[#0f594e] shadow-[0_0_60px_rgba(20,120,105,.25)]">
        <div className="text-center">
          <Network size={34} className="mx-auto text-white" />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
            Graph
          </p>
        </div>
      </div>

      {/* Nodes */}
      <GraphNode
        className="left-[12%] top-[12%]"
        label="Candidate"
        icon={<Users size={17} />}
        tone="teal"
      />

      <GraphNode
        className="right-[12%] top-[12%]"
        label="Skill"
        icon={<Sparkles size={17} />}
        tone="amber"
      />

      <GraphNode
        className="bottom-[12%] left-[12%]"
        label="Project"
        icon={<Workflow size={17} />}
        tone="teal"
      />

      <GraphNode
        className="bottom-[12%] right-[12%]"
        label="Company"
        icon={<Target size={17} />}
        tone="amber"
      />

      {/* Data flow */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-medium text-white/70 backdrop-blur">
        Candidate → Skill → Project → Company
      </div>
    </div>
  );
}

function GraphNode({ className, label, icon, tone }) {
  const isAmber = tone === "amber";

  return (
    <div className={`absolute ${className} flex flex-col items-center gap-2`}>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
          isAmber
            ? "border-amber-200/30 bg-[#30271c] text-[#e8c99e]"
            : "border-teal-200/20 bg-[#19342f] text-[#b7d9d1]"
        } shadow-lg`}
      >
        {icon}
      </div>

      <span className="text-[11px] font-semibold text-white/70">
        {label}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------
   Workflow card
--------------------------------------------------------- */

function WorkflowCard({
  number,
  icon: Icon,
  eyebrow,
  title,
  description,
  accent,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group relative min-h-[280px] overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface)] p-7 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,.08)]"
    >
      <div
        className={`absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150 ${
          accent === "amber" ? "bg-amber-200/30" : "bg-teal-200/30"
        }`}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div
            className={`grid h-12 w-12 place-items-center rounded-2xl ${
              accent === "amber"
                ? "bg-[#f2dfc3] text-[#a55d17]"
                : "bg-[#d8ebe6] text-[#0f594e]"
            }`}
          >
            <Icon size={21} />
          </div>

          <span className="font-data text-xs text-[var(--color-muted)]">
            {number}
          </span>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            {eyebrow}
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
            {title}
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-ink-soft)]">
            {description}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-7 text-sm font-semibold text-[var(--color-teal-700)]">
          Open workflow
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------
   New landing dashboard
--------------------------------------------------------- */

function Dashboard({ onNavigate }) {
  return (
    <main className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(22,112,97,.12),transparent_32%),radial-gradient(circle_at_10%_90%,rgba(224,167,96,.10),transparent_28%)]" />

        <div className="relative grid min-h-[590px] grid-cols-1 items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_1fr] lg:p-14">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              <Sparkles size={13} className="text-[#a55d17]" />
              Graph-powered recruiting intelligence
            </div>

            <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--color-ink)] sm:text-6xl lg:text-[72px]">
              Recruit through
              <span className="block text-[var(--color-teal-700)]">
                the connections.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
              GraphHire connects candidates, skills, projects and companies
              into a knowledge graph — then uses those relationships to solve
              real recruiting decisions.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("candidates")}
                className="group inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-700)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Explore candidates
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => onNavigate("team")}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-canvas)]"
              >
                Build a team
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-teal-700)]" />
                Graph-based search
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#b86b1e]" />
                Minimum team coverage
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-teal-700)]" />
                Multi-hop skill paths
              </span>
            </div>
          </div>

          <NetworkVisual />
        </div>
      </section>

      {/* WORKFLOW INTRO */}
      <section className="px-1 pt-5">
        <div className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Three graph workflows
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            From graph data to recruiting decisions.
          </h2>

          <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">
            Each workflow answers a different recruiting question while using
            the same connected graph underneath.
          </p>
        </div>
      </section>

      {/* THREE WORKFLOWS */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <WorkflowCard
          number="01"
          icon={Users}
          eyebrow="Talent discovery"
          title="Find connected talent"
          description="Search candidates by name or skill, then inspect the skills, projects, companies and experience connected to each profile."
          accent="teal"
          onClick={() => onNavigate("candidates")}
        />

        <WorkflowCard
          number="02"
          icon={Target}
          eyebrow="Team optimization"
          title="Build the smallest team"
          description="Select required skills and use graph relationships to identify the minimum candidate set capable of covering the project requirements."
          accent="amber"
          onClick={() => onNavigate("team")}
        />

        <WorkflowCard
          number="03"
          icon={Route}
          eyebrow="Skill intelligence"
          title="Discover skill paths"
          description="Traverse related skills from a candidate's existing capabilities to identify useful next-step development opportunities."
          accent="teal"
          onClick={() => onNavigate("gap")}
        />
      </section>

      {/* DATA → DECISION */}
      <section className="relative overflow-hidden rounded-[30px] border border-[var(--color-line)] bg-[#101417] p-7 text-white sm:p-10">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <PipelineStep
            number="01"
            title="Graph data"
            description="Candidates, skills, projects and companies become connected nodes."
          />

          <ArrowRight className="hidden text-white/30 lg:block" />

          <PipelineStep
            number="02"
            title="Graph traversal"
            description="Cypher queries follow relationships instead of treating records independently."
          />

          <ArrowRight className="hidden text-white/30 lg:block" />

          <PipelineStep
            number="03"
            title="Recruiting decision"
            description="Search talent, build teams and discover skill paths from the same graph."
          />
        </div>
      </section>

      {/* INTERVIEWER SNAPSHOT */}
      <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface)] p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                What the application demonstrates
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                One graph. Three recruiting problems.
              </h2>
            </div>

            <BrainCircuit className="text-[var(--color-teal-700)]" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MiniCapability
              title="Search"
              text="Find candidates through connected skills."
            />

            <MiniCapability
              title="Optimize"
              text="Cover requirements with fewer candidates."
            />

            <MiniCapability
              title="Recommend"
              text="Find next skills through relationships."
            />
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface)] p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Architecture
          </p>

          <div className="mt-6 space-y-4">
            <ArchitectureItem label="Frontend" value="React + Vite" />
            <ArchitectureItem label="API" value="Express + Node.js" />
            <ArchitectureItem label="Graph" value="Neo4j / CognoDB" />
            <ArchitectureItem label="Queries" value="Cypher" />
          </div>
        </div>
      </section>
    </main>
  );
}

function PipelineStep({ number, title, description }) {
  return (
    <div>
      <span className="font-data text-xs text-teal-300/70">{number}</span>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
        {description}
      </p>
    </div>
  );
}

function MiniCapability({ title, text }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-5">
      <p className="font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
        {text}
      </p>
    </div>
  );
}

function ArchitectureItem({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
      <span className="text-xs text-[var(--color-muted)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--color-ink)]">
        {value}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------
   App shell
--------------------------------------------------------- */

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const activeNav = NAV.find((item) => item.id === activeTab);

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] font-[var(--font-body)] text-[var(--color-ink)]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          {/* Brand */}
          <button
            onClick={() => handleNavigate("dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-teal-700)] shadow-sm">
              <GraphMark />
            </span>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                GraphHire
              </h1>

              <p className="font-data text-[10px] text-[var(--color-muted)]">
                recruiting graph · CognoDB
              </p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden items-center gap-1.5 md:flex">
            {NAV.map(({ id, label }) => {
              const active = activeTab === id;

              return (
                <button
                  key={id}
                  onClick={() => handleNavigate(id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "bg-[var(--color-teal-700)] text-white shadow-sm"
                      : "text-[var(--color-ink-soft)] hover:bg-[var(--color-canvas)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Workflow
              size={14}
              className="text-[var(--color-teal-700)]"
            />

            <span className="text-xs font-medium text-[var(--color-muted)]">
              3 connected workflows
            </span>
          </div>

          {/* Mobile navigation */}
          <select
            value={activeTab}
            onChange={(e) => handleNavigate(e.target.value)}
            className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm md:hidden"
          >
            {NAV.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* FULL WIDTH APP CONTAINER */}
      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Workflow breadcrumb for non-dashboard screens */}
        {activeTab !== "dashboard" && (
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Current workflow
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {activeNav?.label}
              </h2>
            </div>

            <button
              onClick={() => handleNavigate("dashboard")}
              className="hidden items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:bg-[var(--color-canvas)] sm:flex"
            >
              Dashboard
              <ArrowUpRight size={15} />
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <Dashboard onNavigate={handleNavigate} />
        )}

        {/* CANDIDATES */}
        {activeTab === "candidates" && (
          <div className="space-y-6">
            <GraphDashboard />
            <CandidateExplorer />
          </div>
        )}

        {/* TEAM BUILDER */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <GraphDashboard />
            <TeamBuilder />
          </div>
        )}

        {/* SKILL PATHS */}
        {activeTab === "gap" && (
          <div className="space-y-6">
            <GraphDashboard />
            <SkillGapExplorer />
          </div>
        )}
      </div>
    </div>
  );
}