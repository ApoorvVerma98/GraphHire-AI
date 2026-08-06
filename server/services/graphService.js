import driver from "../config/db.js";

export const getGraphStats = async () => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (n)
      OPTIONAL MATCH ()-[r]->()

      RETURN
        count(DISTINCT n) AS totalNodes,
        count(DISTINCT r) AS totalRelationships
    `);

    const record = result.records[0];

    return {
      totalNodes: record.get("totalNodes").toNumber(),
      totalRelationships: record.get("totalRelationships").toNumber(),
    };
  } finally {
    await session.close();
  }
};

export const getTopSkills = async () => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (:Candidate)-[:KNOWS]->(s:Skill)

      RETURN
        s.name AS skill,
        count(*) AS count

      ORDER BY count DESC
    `);

    return result.records.map((record) => ({
      skill: record.get("skill"),
      count: record.get("count").toNumber(),
    }));
  } finally {
    await session.close();
  }
};

export const getTopCompanies = async () => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (:Candidate)-[:WORKED_AT]->(c:Company)

      RETURN
        c.name AS company,
        count(*) AS count

      ORDER BY count DESC
    `);

    return result.records.map((record) => ({
      company: record.get("company"),
      count: record.get("count").toNumber(),
    }));
  } finally {
    await session.close();
  }
};