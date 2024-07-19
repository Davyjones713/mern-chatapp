import express from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import ProtectedRoute from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/:id", ProtectedRoute, getMessage);
router.post("/send/:id", ProtectedRoute, sendMessage);

export default router;
