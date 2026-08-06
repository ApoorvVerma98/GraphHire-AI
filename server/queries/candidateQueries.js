// Fetch all candidates with their skills
export const GET_ALL_CANDIDATES = `
  MATCH (c:Candidate)-[:KNOWS]->(s:Skill)
  RETURN c.id AS id, c.name AS name, c.role AS role, collect(s.name) AS skills
`;

// Fetch single candidate with skills and project experience (multi-hop traversal)
export const GET_CANDIDATE_BY_ID = `
  MATCH (c:Candidate {id: $id})
  OPTIONAL MATCH (c)-[:KNOWS]->(s:Skill)
  OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
  RETURN c.id AS id, c.name AS name, c.role AS role, 
         collect(DISTINCT s.name) AS skills, 
         collect(DISTINCT p.name) AS projects
`;

// Search candidates by skill match
export const SEARCH_CANDIDATES_BY_SKILL = `
  MATCH (c:Candidate)-[:KNOWS]->(s:Skill)
  WHERE toLower(s.name) CONTAINS toLower($query) OR toLower(c.name) CONTAINS toLower($query)
  RETURN c.id AS id, c.name AS name, c.role AS role, collect(DISTINCT s.name) AS skills
`;

// Phase 2: Team Builder (Set-Cover Strategy using Cypher traversal)
export const BUILD_TEAM_BY_SKILLS = `
  WITH $requiredSkills AS reqSkills
  MATCH (c:Candidate)-[:KNOWS]->(s:Skill)
  WHERE s.name IN reqSkills
  WITH c, collect(DISTINCT s.name) AS candidateSkills, reqSkills
  RETURN c.id AS id, 
         c.name AS name, 
         c.role AS role, 
         candidateSkills AS matchingSkills,
         size(candidateSkills) AS skillMatchCount
  ORDER BY skillMatchCount DESC
`;

// Phase 2: Skill Gap Explorer (Multi-hop path traversal: Candidate -> Skill -> Related Skill)
export const EXPLORE_SKILL_GAPS = `
  MATCH (c:Candidate {id: $candidateId})-[:KNOWS]->(s:Skill)-[:RELATED_TO]->(related:Skill)
  WHERE NOT (c)-[:KNOWS]->(related)
  RETURN DISTINCT related.name AS missingSkill, collect(s.name) AS prerequisites
`;