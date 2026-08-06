import { getConnectionStatus } from "../config/db.js";

export function requireDbConnection(req, res, next) {
  if (!getConnectionStatus().available) {
    return res.status(503).json({
      success: false,
      message: "The graph database is temporarily unavailable. Please try again shortly.",
    });
  }

  next();
}
