import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const timeframe = searchParams.get("timeframe");

    // We join with a subquery to get total marks per exam from the questions table
    let sql = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        COUNT(a.id) as totalExams,
        SUM(a.score) as totalScore,
        SUM(COALESCE(exam_marks.totalPossible, 100)) as totalPossibleMarks
      FROM users u
      JOIN attempts a ON u.id = a.user_id
      JOIN exams e ON a.exam_id = e.id
      LEFT JOIN (
        SELECT exam_id, SUM(marks) as totalPossible 
        FROM questions 
        GROUP BY exam_id
      ) as exam_marks ON e.id = exam_marks.exam_id
      WHERE u.role = 'STUDENT' AND a.status = 'SUBMITTED'
    `;

    const args: any[] = [];

    if (category) {
      sql += " AND e.category_id = ?";
      args.push(category);
    }

    if (timeframe === "7d") {
      sql += " AND a.submit_time >= date('now', '-7 days')";
    } else if (timeframe === "30d") {
      sql += " AND a.submit_time >= date('now', '-30 days')";
    }

    sql += " GROUP BY u.id";

    const result = await db.execute({ sql, args });

    const leaderboard = result.rows.map((row: any) => {
      const percentage = row.totalPossibleMarks > 0 
        ? (Number(row.totalScore) / Number(row.totalPossibleMarks)) * 100 
        : 0;

      return {
        id: row.id,
        name: row.name,
        email: row.email,
        totalExams: Number(row.totalExams),
        totalScore: Number(row.totalScore),
        percentage: Number(percentage.toFixed(2)),
      };
    });

    // Sort descending by percentage
    leaderboard.sort((a, b) => b.percentage - a.percentage);

    // Assign ranks
    const ranked = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({ success: true, data: ranked });
  } catch (error: any) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json(
      { success: false, error: `Leaderboard failed: ${error.message}` },
      { status: 500 }
    );
  }
}
