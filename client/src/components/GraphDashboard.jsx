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
    return (
      <div className="rounded-2xl border border-[var(--color-amber-100)] bg-[var(--color-amber-50)] p-4 text-sm text-[var(--color-amber-900)]">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-muted)]" role="status">
        Loading graph overview…
      </div>
    );
  }

  const topSkill = skills[0];
  const topCompany = companies[0];

  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">Live graph overview</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Your talent network at a glance</h2>
          </div>
          <span className="rounded-xl bg-[var(--color-teal-50)] p-2.5 text-[var(--color-teal-700)]">
            <Network size={20} />
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Metric icon={Waypoints} label="Graph nodes" value={stats.totalNodes} tone="teal" />
          <Metric icon={Network} label="Relationships" value={stats.totalRelationships} tone="amber" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <Insight
          icon={Sparkles}
          label="Most represented skill"
          value={topSkill?.skill || "No skill data"}
          meta={topSkill ? `${topSkill.count} candidates` : ""}
        />
        <Insight
          icon={Building2}
          label="Leading company source"
          value={topCompany?.company || "No company data"}
          meta={topCompany ? `${topCompany.count} candidate${topCompany.count === 1 ? "" : "s"}` : ""}
        />
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value, tone }) {
  const tones = {
    teal: { bg: "var(--color-teal-50)", fg: "var(--color-teal-700)" },
    amber: { bg: "var(--color-amber-50)", fg: "var(--color-amber-700)" },
  };
  const t = tones[tone];

  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
      <span className="inline-flex rounded-lg p-2" style={{ background: t.bg, color: t.fg }}>
        <Icon size={17} />
      </span>
      <p className="font-data mt-4 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-medium text-[var(--color-muted)]">{label}</p>
    </div>
  );
}

function Insight({ icon: Icon, label, value, meta }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-2 text-[var(--color-muted)]">
        <Icon size={16} />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-3 truncate text-base font-semibold">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-muted)]">{meta}</p>
    </div>
  );
}
