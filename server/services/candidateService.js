import { runQuery } from '../config/db.js';
import { 
  GET_ALL_CANDIDATES, 
  GET_CANDIDATE_BY_ID, 
  SEARCH_CANDIDATES_BY_SKILL,
  BUILD_TEAM_BY_SKILLS, 
  EXPLORE_SKILL_GAPS
} from '../queries/candidateQueries.js';

export const fetchAllCandidates = async () => {
  return await runQuery(GET_ALL_CANDIDATES);
};

export const fetchCandidateById = async (id) => {
  const result = await runQuery(GET_CANDIDATE_BY_ID, { id });
  return result.length > 0 ? result[0] : null;
};

export const searchCandidates = async (query) => {
  return await runQuery(SEARCH_CANDIDATES_BY_SKILL, { query });
};

export async function calculateTeamBuilder(requiredSkills) {
  return await runQuery(BUILD_TEAM_BY_SKILLS, { requiredSkills });
}

export async function findSkillGaps(candidateId) {
  return await runQuery(EXPLORE_SKILL_GAPS, { candidateId });
}