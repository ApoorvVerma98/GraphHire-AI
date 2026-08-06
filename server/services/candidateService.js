import { runQuery } from "../config/db.js";
import {
  GET_ALL_CANDIDATES,
  GET_CANDIDATE_BY_ID,
  SEARCH_CANDIDATES_BY_SKILL,
  GET_CANDIDATE_SKILL_COVERAGE,
  EXPLORE_SKILL_GAPS,
  GET_SKILL_PATH_VALIDATION,
  GET_SKILL_PATH_RELATED,
} from "../queries/candidateQueries.js";

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
  const normalizedSkills = [
    ...new Set(
      requiredSkills
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean),
    ),
  ];

  const candidates = await runQuery(GET_CANDIDATE_SKILL_COVERAGE, {
    requiredSkills: normalizedSkills,
  });
  const remainingSkills = new Set(normalizedSkills);
  const team = [];
  const unselectedCandidates = [...candidates];

  while (remainingSkills.size > 0 && unselectedCandidates.length > 0) {
    const rankedCandidates = unselectedCandidates
      .map((candidate) => ({
        ...candidate,
        contributionSkills: candidate.matchingSkills.filter((skill) =>
          remainingSkills.has(skill),
        ),
      }))
      .sort(
        (a, b) =>
          b.contributionSkills.length - a.contributionSkills.length ||
          b.skillMatchCount - a.skillMatchCount ||
          a.name.localeCompare(b.name),
      );
    const bestCandidate = rankedCandidates[0];

    if (!bestCandidate || bestCandidate.contributionSkills.length === 0) {
      break;
    }

    team.push(bestCandidate);
    bestCandidate.contributionSkills.forEach((skill) =>
      remainingSkills.delete(skill),
    );
    unselectedCandidates.splice(
      unselectedCandidates.findIndex(
        (candidate) => candidate.id === bestCandidate.id,
      ),
      1,
    );
  }

  return {
    team,
    allMatches: candidates,
    coveredSkills: normalizedSkills.filter(
      (skill) => !remainingSkills.has(skill),
    ),
    uncoveredSkills: [...remainingSkills],
  };
}

export async function findSkillGaps(candidateId) {
  const data = await runQuery(EXPLORE_SKILL_GAPS, { candidateId });
  const related = await runQuery(GET_SKILL_PATH_RELATED, { candidateId });
  const validation = await runQuery(GET_SKILL_PATH_VALIDATION, { candidateId });
  const stats = validation[0] || { knownSkills: [] };
  const relatedSkills = related[0]?.relatedSkills || [];
  return {
    data,
    knownSkills: stats.knownSkills || [],
    relatedSkills,
    relatedSkillCount: relatedSkills.length,
  };
}
