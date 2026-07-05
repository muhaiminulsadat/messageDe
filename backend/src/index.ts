import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration (crucial for cookies and session credentials)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Better Auth route handler (MUST be mounted before body parsers)
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Body parsers (placed after Better Auth)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();

