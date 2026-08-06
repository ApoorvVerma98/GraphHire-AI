import { useEffect, useState } from "react";
import { Building2, Network, Sparkles, Waypoints } from "lucide-react";
import { getGraphStats, getTopSkills, getTopCompanies } from "../services/api";

export default function GraphDashboard() {
  const [stats, setStats] = useState(null);
  const [skills, setSkills] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, skillsRes, companiesRes] = await Promise.all([
          getGraphStats(),
          getTopSkills(),
          getTopCompanies(),
        ]);
        setStats(statsRes.data.data);
        setSkills(skillsRes.data.data);
        setCompanies(companiesRes.data.data);
      } catch (err) {
        console.error(err);
        setError("Graph data is temporarily unavailable. Please try again shortly.");
      }
    }

    load();
  }, []);

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!stats) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm" role="status">Loading graph overview…</div>;
  }

  const topSkill = skills[0];
  const topCompany = companies[0];

  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Live graph overview</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Your talent network at a glance</h2>
          </div>
          <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Network size={20} /></span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Metric icon={Waypoints} label="Graph nodes" value={stats.totalNodes} tone="indigo" />
          <Metric icon={Network} label="Relationships" value={stats.totalRelationships} tone="emerald" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <Insight icon={Sparkles} label="Most represented skill" value={topSkill?.skill || "No skill data"} meta={topSkill ? `${topSkill.count} candidates` : ""} />
        <Insight icon={Building2} label="Leading company source" value={topCompany?.company || "No company data"} meta={topCompany ? `${topCompany.count} candidate${topCompany.count === 1 ? "" : "s"}` : ""} />
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value, tone }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <span className={`inline-flex rounded-lg p-2 ${tones[tone]}`}><Icon size={17} /></span>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function Insight({ icon: Icon, label, value, meta }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400"><Icon size={16} /><span className="text-xs font-bold uppercase tracking-wide">{label}</span></div>
      <p className="mt-3 truncate text-base font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{meta}</p>
    </div>
  );
}
