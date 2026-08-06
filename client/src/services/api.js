import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const candidateAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/candidates`,
});

const graphAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/graph`,
});

// Candidate APIs
export const getAllCandidates = () => candidateAPI.get("/");
export const getCandidateById = (id) => candidateAPI.get(`/${id}`);
export const searchCandidates = (q) => candidateAPI.get(`/search?q=${q}`);
export const getSkillGaps = (id) => candidateAPI.get(`/${id}/skill-gap`);
export const buildTeam = (skills) =>
  candidateAPI.post("/team-builder", { skills });

// Graph APIs
export const getGraphStats = () => graphAPI.get("/stats");
export const getTopSkills = () => graphAPI.get("/top-skills");
export const getTopCompanies = () => graphAPI.get("/top-companies");