import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, getConnectionStatus } from "./config/db.js";
import { requireDbConnection } from "./middleware/requireDbConnection.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import graphRoutes from "./routes/graphRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, curl, mobile apps, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/candidates", requireDbConnection, candidateRoutes);
app.use("/api/graph", requireDbConnection, graphRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GraphHire AI Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB();
});

app.get("/health", (req, res) => {
  const { available } = getConnectionStatus();
  res.status(available ? 200 : 503).json({
    success: available,
    database: available ? "available" : "unavailable",
  });
});
