import axios from "axios";

const candidateAPI = axios.create({
  baseURL: "http://localhost:5000/api/candidates",
});

const graphAPI = axios.create({
  baseURL: "http://localhost:5000/api/graph",
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