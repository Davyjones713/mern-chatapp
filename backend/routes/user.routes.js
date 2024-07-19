import express from "express";
import ProtectedRoute from "../middleware/protectedRoute.js";
import getUsersForSidebar from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", ProtectedRoute, getUsersForSidebar);

export default router;
