import express from "express";
import {
  getConversationsForSidebar,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.ts";
import protectRoute from "../middleware/auth.middleware.ts";
import {upload} from "../middleware/upload.middleware.ts";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/conversations", protectRoute, getConversationsForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("media"), sendMessage);

// TIMESTAMP: 2:15:00

export default router;
