import { Response } from "express";
import { db } from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  const examId = req.params.examId || req.query.examId;

  try {
    let query = "";
    let args: any[] = [];

    if (examId && examId !== "all" && examId !== "") {
      // Exam-specific leaderboard
      query = `
        SELECT 
            u.name,
            u.email,
            e.title AS examTitle,
            a.exam_id,
            ROUND((CAST(SUM(ans.marks_awarded) AS FLOAT) * 100.0) / CAST(SUM(q.marks) AS FLOAT), 2) AS averagePercentage,
            SUM(ans.marks_awarded) AS score,
            (strftime('%s', a.submit_time) - strftime('%s', a.start_time)) AS timeTaken,
            a.submit_time
        FROM attempts a
        JOIN answers ans ON ans.attempt_id = a.id
        JOIN questions q ON q.id = ans.question_id
        JOIN users u ON u.id = a.user_id
        JOIN exams e ON e.id = a.exam_id
        WHERE a.exam_id = ? AND a.status = 'SUBMITTED'
        GROUP BY a.id
        ORDER BY averagePercentage DESC, timeTaken ASC, a.submit_time ASC;
      `;
      args = [examId];
    } else {
      // Global leaderboard (aggregated per user)
      query = `
        SELECT 
            u.id as user_id,
            u.name,
            u.email,
            COUNT(DISTINCT a.id) as totalExams,
            COALESCE(ROUND(AVG(a.score), 2), 0) as averagePercentage,
            COALESCE(SUM(a.score), 0) as totalScore
        FROM users u
        LEFT JOIN attempts a ON u.id = a.user_id AND a.status = 'SUBMITTED'
        WHERE u.role = 'STUDENT'
        GROUP BY u.id
        ORDER BY averagePercentage DESC, totalScore DESC, u.name ASC;
      `;
    }

    const result = await db.execute({
      sql: query,
      args: args,
    });

    console.log(`Leaderboard query returned ${result.rows.length} rows for examId: ${examId}`);
    res.json(result.rows);
  } catch (error) {
    console.error("Leaderboard Controller Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
