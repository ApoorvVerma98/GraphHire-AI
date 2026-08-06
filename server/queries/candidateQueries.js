// Fetch all candidates with their skills
export const GET_ALL_CANDIDATES = `
  MATCH (c:Candidate)-[:KNOWS]->(s:Skill)
  RETURN c.id AS id, c.name AS name, c.role AS role, c.location AS location,
         c.experience AS experience, c.availability AS availability, collect(s.name) AS skills
`;

// Fetch single candidate with skills and project experience (multi-hop traversal)
export const GET_CANDIDATE_BY_ID = `
  MATCH (c:Candidate {id: $id})
  OPTIONAL MATCH (c)-[:KNOWS]->(s:Skill)
  OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
  RETURN c.id AS id, c.name AS name, c.role AS role, c.location AS location,
         c.experience AS experience, c.availability AS availability, c.summary AS summary,
         collect(DISTINCT s.name) AS skills, 
         collect(DISTINCT p.name) AS projects
`;

// Search candidates by skill match
export const SEARCH_CANDIDATES_BY_SKILL = `
  MATCH (c:Candidate)-[:KNOWS]->(s:Skill)
  WHERE toLower(s.name) CONTAINS toLower($query) OR toLower(c.name) CONTAINS toLower($query)
  RETURN c.id AS id, c.name AS name, c.role AS role, c.location AS location,
         c.experience AS experience, c.availability AS availability, collect(DISTINCT s.name) AS skills
`;

// Returns each eligible candidate's coverage. The service applies the greedy
// set-cover selection so the algorithm is explicit and testable in JavaScript.
export const GET_CANDIDATE_SKILL_COVERAGE = `
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

export const GET_SKILL_PATH_RELATED = `
  MATCH (c:Candidate {id: $candidateId})-[:KNOWS]->(s:Skill)-[:RELATED_TO]->(related:Skill)
  WITH related, collect(DISTINCT s.name) AS prerequisites
  RETURN collect({ related: related.name, prerequisites: prerequisites }) AS relatedSkills
`;

export const GET_SKILL_PATH_VALIDATION = `
  MATCH (c:Candidate {id: $candidateId})
  OPTIONAL MATCH (c)-[:KNOWS]->(s:Skill)
  RETURN collect(DISTINCT s.name) AS knownSkills
`;
