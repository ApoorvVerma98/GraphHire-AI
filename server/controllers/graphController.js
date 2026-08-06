import {
  getGraphStats,
  getTopSkills,
  getTopCompanies,
} from "../services/graphService.js";

export const graphStats = async (req, res) => {
  try {
    const data = await getGraphStats();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch graph stats",
    });
  }
};

export const topSkills = async (req, res) => {
  try {
    const data = await getTopSkills();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top skills",
    });
  }
};

export const topCompanies = async (req, res) => {
  try {
    const data = await getTopCompanies();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top companies",
    });
  }
};