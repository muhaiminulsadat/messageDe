import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import {connectDB} from "./lib/db.ts";
import {auth} from "./lib/auth.ts";
import {toNodeHandler} from "better-auth/node";
import job from "./lib/cron.ts";
import authRoute from "./routes/auth.route.ts";
import messageRoutes from "./routes/message.route.ts";
import {app, server} from "./lib/socket.ts";

const PORT = process.env.PORT || 3000;

app.set("trust proxy", true);

// 1. Global Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// 2. Custom Auth Routes
app.use("/api/auth", authRoute);

// 3. Authentication Handler (Better Auth)
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// 4. API Routes
app.use("/api/messages", messageRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({status: "ok"});
});

// 4. Static Frontend Serving (Production)
const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("/*splat", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

// 5. Server Initialization
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      if (process.env.NODE_ENV === "production") {
        job.start();
      }
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
