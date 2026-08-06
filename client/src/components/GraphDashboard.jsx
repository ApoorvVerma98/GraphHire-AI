import { useEffect, useState } from "react";
import {
  getGraphStats,
  getTopSkills,
  getTopCompanies,
} from "../services/api";

export default function GraphDashboard() {
  const [stats, setStats] = useState(null);
  const [skills, setSkills] = useState([]);
  const [companies, setCompanies] = useState([]);

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
      }
    }

    load();
  }, []);

  if (!stats) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">

      <h2 className="text-xl font-bold">
        📊 Graph Database Overview
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="text-gray-500 text-sm">
            Total Nodes
          </p>

          <h2 className="text-3xl font-bold text-indigo-700">
            {stats.totalNodes}
          </h2>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <p className="text-gray-500 text-sm">
            Relationships
          </p>

          <h2 className="text-3xl font-bold text-emerald-700">
            {stats.totalRelationships}
          </h2>
        </div>

      </div>

      <div>

        <h3 className="font-bold mb-3">
          🔥 Top Skills
        </h3>

        {skills.map((skill) => (
          <div
            key={skill.skill}
            className="flex justify-between py-2 border-b"
          >
            <span>{skill.skill}</span>

            <span className="font-bold">
              {skill.count}
            </span>
          </div>
        ))}

      </div>

      <div>

        <h3 className="font-bold mb-3">
          🏢 Top Companies
        </h3>

        {companies.map((company) => (
          <div
            key={company.company}
            className="flex justify-between py-2 border-b"
          >
            <span>{company.company}</span>

            <span className="font-bold">
              {company.count}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}