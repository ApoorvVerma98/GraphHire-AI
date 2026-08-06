import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import graphRoutes from "./routes/graphRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/candidates", candidateRoutes);
app.use("/api/graph", graphRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GraphHire AI Backend Running 🚀"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});