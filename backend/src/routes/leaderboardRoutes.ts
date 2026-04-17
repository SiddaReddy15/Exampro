import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboardController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

// Allow both ADMIN and STUDENT to view the leaderboard
router.get("/", authenticate, getLeaderboard);
router.get("/:examId", authenticate, getLeaderboard);

export default router;
