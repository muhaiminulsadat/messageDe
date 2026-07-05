import express from "express";
import cors from "cors";
import {connectDB} from "./lib/db.ts";
import {auth} from "./lib/auth.ts";
import {toNodeHandler} from "better-auth/node";
import path from "node:path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(process.cwd(), "public");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/health", (req, res) => {
  res.status(200).json({status: "ok"});
});

// =============================================

// if the public directory exists, serve the static files
// this is for the production build
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

// =============================================

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
