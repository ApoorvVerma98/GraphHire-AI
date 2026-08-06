import express from "express";

import {
  graphStats,
  topSkills,
  topCompanies,
} from "../controllers/graphController.js";

const router = express.Router();

router.get("/stats", graphStats);

router.get("/top-skills", topSkills);

router.get("/top-companies", topCompanies);

export default router;