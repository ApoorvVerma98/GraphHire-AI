import {
  getGraphStats,
  getTopSkills,
  getTopCompanies,
} from "../services/graphService.js";
import { getConnectionStatus } from "../config/db.js";

const sendGraphError = (res) => {
  const databaseAvailable = getConnectionStatus().available;
  return res.status(databaseAvailable ? 500 : 503).json({
    success: false,
    message: databaseAvailable
      ? "Unable to retrieve graph data. Please try again."
      : "The graph database is temporarily unavailable. Please try again shortly.",
  });
};

export const graphStats = async (req, res) => {
  try {
    const data = await getGraphStats();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    sendGraphError(res);
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

    sendGraphError(res);
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

    sendGraphError(res);
  }
};
