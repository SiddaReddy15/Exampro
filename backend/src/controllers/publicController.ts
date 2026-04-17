import { Request, Response } from "express";
import { db } from "../config/db";

export const getPlatformStats = async (req: Request, res: Response) => {
    try {
        const enrolledResult = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'STUDENT'");
        const attemptsResult = await db.execute("SELECT COUNT(*) as count FROM attempts WHERE status = 'SUBMITTED'");
        const accuracyResult = await db.execute("SELECT AVG(score) as avg_score FROM attempts WHERE status = 'SUBMITTED'");
        
        // Mocking uptime as 100% (or fetch from a settings table if it exists)
        const uptime = 100;

        const enrolled = enrolledResult.rows[0].count;
        const automated = attemptsResult.rows[0].count;
        const accuracy = accuracyResult.rows[0].avg_score || 0;

        res.json({
            enrolled: enrolled,
            accuracy: Number(accuracy as any).toFixed(1),
            uptime: uptime,
            automated: automated
        });
    } catch (error) {
        console.error("Error fetching platform stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
