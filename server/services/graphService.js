import { runQuery } from "../config/db.js";

export const getGraphStats = async () => {
  const records = await runQuery(`
      MATCH (n)
      OPTIONAL MATCH ()-[r]->()

      RETURN
        count(DISTINCT n) AS totalNodes,
        count(DISTINCT r) AS totalRelationships
    `);
  const record = records[0];

  return {
    totalNodes: record.totalNodes,
    totalRelationships: record.totalRelationships,
  };
};

export const getTopSkills = async () => {
  return runQuery(`
      MATCH (:Candidate)-[:KNOWS]->(s:Skill)

      RETURN
        s.name AS skill,
        count(*) AS count

      ORDER BY count DESC
    `);
};

export const getTopCompanies = async () => {
  return runQuery(`
      MATCH (:Candidate)-[:WORKED_AT]->(c:Company)

      RETURN
        c.name AS company,
        count(*) AS count

      ORDER BY count DESC
    `);
};
