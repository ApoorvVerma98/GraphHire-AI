import driver from "../config/db.js";

import {
  skills,
  companies,
  technologies,
  certifications,
  projects,
  roles,
  candidates,
  candidateSkills,
  candidateCompany,
  candidateProjects,
  candidateCertification,
  projectSkills,
  skillMetadata,
} from "./seedData.js";

const session = driver.session();

async function seedDatabase() {
  try {
    console.log("🚀 Starting GraphHire AI database seeding...");

    // ==========================================================
    // Constraints
    // ==========================================================

    await session.run(`
      CREATE CONSTRAINT candidate_id IF NOT EXISTS
      FOR (c:Candidate)
      REQUIRE c.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT skill_name IF NOT EXISTS
      FOR (s:Skill)
      REQUIRE s.name IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT company_name IF NOT EXISTS
      FOR (c:Company)
      REQUIRE c.name IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT project_name IF NOT EXISTS
      FOR (p:Project)
      REQUIRE p.name IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT technology_name IF NOT EXISTS
      FOR (t:Technology)
      REQUIRE t.name IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT certification_name IF NOT EXISTS
      FOR (c:Certification)
      REQUIRE c.name IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT role_name IF NOT EXISTS
      FOR (r:Role)
      REQUIRE r.name IS UNIQUE
    `);

    console.log("✅ Constraints Created");

    // ==========================================================
    // Indexes
    // ==========================================================

    await session.run(`
      CREATE INDEX candidate_name IF NOT EXISTS
      FOR (c:Candidate)
      ON (c.name)
    `);

    await session.run(`
      CREATE INDEX skill_lookup IF NOT EXISTS
      FOR (s:Skill)
      ON (s.name)
    `);

    console.log("✅ Indexes Created");

    // ==========================================================
    // Skills
    // ==========================================================

    for (const skill of skills) {
      await session.run(
        `
        MERGE (s:Skill {name:$name})
        `,
        {
          name: skill,
        }
      );
    }

    console.log(`✅ ${skills.length} Skills Inserted`);

    // ==========================================================
    // Companies
    // ==========================================================

    for (const company of companies) {
      await session.run(
        `
        MERGE (c:Company {name:$name})
        `,
        {
          name: company,
        }
      );
    }

    console.log(`✅ ${companies.length} Companies Inserted`);

    // ==========================================================
    // Technologies
    // ==========================================================

    for (const tech of technologies) {
      await session.run(
        `
        MERGE (t:Technology {name:$name})
        `,
        {
          name: tech,
        }
      );
    }

    console.log(`✅ ${technologies.length} Technologies Inserted`);

    // ==========================================================
    // Certifications
    // ==========================================================

    for (const cert of certifications) {
      await session.run(
        `
        MERGE (c:Certification {name:$name})
        `,
        {
          name: cert,
        }
      );
    }

    console.log(`✅ ${certifications.length} Certifications Inserted`);

    // ==========================================================
    // Projects
    // ==========================================================

    for (const project of projects) {
      await session.run(
        `
        MERGE (p:Project {name:$name})
        `,
        {
          name: project,
        }
      );
    }

    console.log(`✅ ${projects.length} Projects Inserted`);

    // ==========================================================
    // Roles
    // ==========================================================

    for (const role of roles) {
      await session.run(
        `
        MERGE (r:Role {name:$name})
        `,
        {
          name: role,
        }
      );
    }

    console.log(`✅ ${roles.length} Roles Inserted`);

    // ==========================================================
    // Candidates
    // ==========================================================

    for (const candidate of candidates) {
      await session.run(
        `
        MERGE (c:Candidate {id:$id})

        SET
          c.name = $name,
          c.role = $role,
          c.email = $email,
          c.location = $location,
          c.experience = $experience
        `,
        candidate
      );
    }

    console.log(`✅ ${candidates.length} Candidates Inserted`);

    // ==========================================================
    // Candidate -> HAS_ROLE -> Role
    // ==========================================================

    for (const candidate of candidates) {
      await session.run(
        `
        MATCH (c:Candidate {id:$candidateId})
        MATCH (r:Role {name:$role})

        MERGE (c)-[:HAS_ROLE]->(r)
        `,
        {
          candidateId: candidate.id,
          role: candidate.role,
        }
      );
    }

    console.log("✅ Candidate → Role relationships created");

    // ==========================================================
    // Candidate -> KNOWS -> Skill
    // ==========================================================

    for (const candidate of candidates) {
  const candidateSkillList = candidateSkills[candidate.id];

  for (const skill of candidateSkillList) {
    const meta = skillMetadata[skill];

    await session.run(
      `
      MATCH (c:Candidate {id:$candidateId})
      MATCH (s:Skill {name:$skill})

      MERGE (c)-[r:KNOWS]->(s)

      SET
        r.level=$level,
        r.years=$years
      `,
      {
        candidateId: candidate.id,
        skill,
        level: meta.level,
        years: meta.years,
      }
    );
  }
}

console.log("✅ Candidate → Skill relationships created");

// ==========================================================
// Candidate -> WORKED_AT -> Company
// ==========================================================

for (const candidate of candidates) {
  await session.run(
    `
    MATCH (c:Candidate {id:$candidateId})
    MATCH (company:Company {name:$company})

    MERGE (c)-[:WORKED_AT]->(company)
    `,
    {
      candidateId: candidate.id,
      company: candidateCompany[candidate.id],
    }
  );
}

console.log("✅ Candidate → Company relationships created");

// ==========================================================
// Candidate -> WORKED_ON -> Project
// ==========================================================

for (const candidate of candidates) {
  const projectList = candidateProjects[candidate.id];

  for (const project of projectList) {
    await session.run(
      `
      MATCH (c:Candidate {id:$candidateId})
      MATCH (p:Project {name:$project})

      MERGE (c)-[:WORKED_ON]->(p)
      `,
      {
        candidateId: candidate.id,
        project,
      }
    );
  }
}

console.log("✅ Candidate → Project relationships created");

// ==========================================================
// Project -> USES -> Technology
// ==========================================================

for (const project of projects) {
  const technologiesForProject = projectSkills[project] || [];

  for (const tech of technologiesForProject) {
    if (!technologies.includes(tech)) continue;

    await session.run(
      `
      MATCH (p:Project {name:$project})
      MATCH (t:Technology {name:$tech})

      MERGE (p)-[:USES]->(t)
      `,
      {
        project,
        tech,
      }
    );
  }
}

console.log("✅ Project → Technology relationships created");

// ==========================================================
// Project -> REQUIRES -> Skill
// ==========================================================

for (const project of projects) {
  const skillsForProject = projectSkills[project] || [];

  for (const skill of skillsForProject) {
    await session.run(
      `
      MATCH (p:Project {name:$project})
      MATCH (s:Skill {name:$skill})

      MERGE (p)-[:REQUIRES]->(s)
      `,
      {
        project,
        skill,
      }
    );
  }
}

console.log("✅ Project → Skill relationships created");

// ==========================================================
// Candidate -> HAS_CERTIFICATION -> Certification
// ==========================================================

for (const candidate of candidates) {
  await session.run(
    `
    MATCH (c:Candidate {id:$candidateId})
    MATCH (cert:Certification {name:$cert})

    MERGE (c)-[:HAS_CERTIFICATION]->(cert)
    `,
    {
      candidateId: candidate.id,
      cert: candidateCertification[candidate.id],
    }
  );
}

console.log("✅ Candidate → Certification relationships created");

// ==========================================================
// Skill -> RELATED_TO -> Skill
// ==========================================================

for (let i = 0; i < skills.length - 1; i++) {
  await session.run(
    `
    MATCH (s1:Skill {name:$skill1})
    MATCH (s2:Skill {name:$skill2})

    MERGE (s1)-[:RELATED_TO]->(s2)
    `,
    {
      skill1: skills[i],
      skill2: skills[i + 1],
    }
  );
}

console.log("✅ Skill relationships created");

console.log("");
console.log("🎉 GraphHire AI Database Seeded Successfully!");
console.log("");

} catch (error) {
  console.error("\n❌ SEED FAILED\n");
  console.error(error);

  if (error.code) {
    console.error("Neo4j Code:", error.code);
  }

  console.error(error.stack);

} finally {
  await session.close();
  await driver.close();
}
}

seedDatabase();