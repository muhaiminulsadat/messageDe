import express from "express";
import checkAuth from "../controllers/auth.controller.ts";
import protectRoute from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/check", protectRoute, checkAuth);

export default router;
