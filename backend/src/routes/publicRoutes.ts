import { Router } from "express";
import { getPlatformStats } from "../controllers/publicController";

const router = Router();

router.get("/stats", getPlatformStats);

export default router;
