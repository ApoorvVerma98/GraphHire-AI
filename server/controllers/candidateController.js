import {
  fetchAllCandidates,
  fetchCandidateById,
  searchCandidates,
  calculateTeamBuilder,
  findSkillGaps,
} from "../services/candidateService.js";
import {
  GET_ALL_CANDIDATES,
  GET_CANDIDATE_BY_ID,
  SEARCH_CANDIDATES_BY_SKILL,
  GET_CANDIDATE_SKILL_COVERAGE,
  EXPLORE_SKILL_GAPS,
} from "../queries/candidateQueries.js";
import { getConnectionStatus } from "../config/db.js";

const sendQueryError = (res) => {
  const databaseAvailable = getConnectionStatus().available;
  return res.status(databaseAvailable ? 500 : 503).json({
    success: false,
    message: databaseAvailable
      ? "Unable to complete the graph query. Please try again."
      : "The graph database is temporarily unavailable. Please try again shortly.",
  });
};

export const getCandidates = async (req, res) => {
  const startTime = Date.now();
  try {
    const candidates = await fetchAllCandidates();
    res.status(200).json({
      success: true,
      message: "Candidates retrieved successfully",
      data: candidates,
      metadata: { executionTimeMs: Date.now() - startTime },
      explain: {
        summary:
          "Fetches all candidate nodes and collects connected skill relationships.",
        cypher: GET_ALL_CANDIDATES,
      },
    });
  } catch (error) {
    console.error(error);
    sendQueryError(res);
  }
};

export const getCandidateById = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    // Cast string route parameter to integer for Neo4j lookup
    const parsedId = isNaN(id) ? id : parseInt(id, 10);
    const candidate = await fetchCandidateById(parsedId);

    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Candidate details retrieved successfully",
      data: candidate,
      metadata: { executionTimeMs: Date.now() - startTime },
      explain: {
        summary:
          "Traverses Candidate -> Skill and Candidate -> Project relationships.",
        cypher: GET_CANDIDATE_BY_ID,
      },
    });
  } catch (error) {
    console.error(error);
    sendQueryError(res);
  }
};

export const handleSearch = async (req, res) => {
  const startTime = Date.now();
  const { q } = req.query;
  try {
    const results = await searchCandidates(q || "");
    res.status(200).json({
      success: true,
      message: "Search completed successfully",
      data: results,
      metadata: { executionTimeMs: Date.now() - startTime },
      explain: {
        summary:
          "Filters skill/candidate nodes matching the search term using openCypher CONTAINS.",
        cypher: SEARCH_CANDIDATES_BY_SKILL,
      },
    });
  } catch (error) {
    console.error(error);
    sendQueryError(res);
  }
};

export const handleTeamBuilder = async (req, res) => {
  const startTime = Date.now();
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({
      success: false,
      message: "A 'skills' array is required in the request body.",
    });
  }

  try {
    const recommendation = await calculateTeamBuilder(skills);
    res.status(200).json({
      success: true,
      message: "Minimum-coverage team recommendation generated",
      data: recommendation.team,
      coverage: {
        coveredSkills: recommendation.coveredSkills,
        uncoveredSkills: recommendation.uncoveredSkills,
      },
      metadata: { executionTimeMs: Date.now() - startTime },
      explain: {
        summary:
          "Fetches eligible candidate-to-skill coverage, then applies a greedy set-cover selection to choose candidates that cover the most remaining requested skills.",
        cypher: GET_CANDIDATE_SKILL_COVERAGE,
      },
    });
  } catch (error) {
    console.error(error);
    sendQueryError(res);
  }
};

export const handleSkillGap = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  const parsedId = isNaN(id) ? id : parseInt(id, 10);

  try {
    const gaps = await findSkillGaps(parsedId);
    res.status(200).json({
      success: true,
      message: "Skill gaps and upgrade paths calculated successfully",
      data: gaps,
      metadata: { executionTimeMs: Date.now() - startTime },
      explain: {
        summary:
          "Performs multi-hop traversal (Candidate -> Skill -> RELATED_TO -> Skill) to find missing prerequisites.",
        cypher: EXPLORE_SKILL_GAPS,
      },
    });
  } catch (error) {
    console.error(error);
    sendQueryError(res);
  }
};
