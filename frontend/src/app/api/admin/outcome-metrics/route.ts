import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subDays, subMonths, format } from "date-fns";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7d";
  const examId = searchParams.get("examId");

  try {
    let startDate: Date;
    const now = new Date();

    switch (range) {
      case "30d":
        startDate = subDays(now, 30);
        break;
      case "90d":
        startDate = subMonths(now, 3);
        break;
      case "365d":
        startDate = subMonths(now, 12);
        break;
      case "7d":
      default:
        startDate = subDays(now, 7);
    }

    const startDateStr = format(startDate, "yyyy-MM-dd HH:mm:ss");

    const query = `
      SELECT 
        COUNT(*) as totalAttempts,
        COUNT(CASE WHEN a.score >= e.passing_score THEN 1 END) as passedCount,
        COUNT(CASE WHEN a.score < e.passing_score THEN 1 END) as failedCount,
        AVG(a.score) as averageScore,
        MAX(a.score) as highestScore,
        MIN(a.score) as lowestScore
      FROM attempts a
      JOIN exams e ON a.exam_id = e.id
      WHERE a.submit_time >= ? AND a.status = 'SUBMITTED'
      ${examId ? "AND a.exam_id = ?" : ""}
    `;

    const args: any[] = [startDateStr];
    if (examId) args.push(examId);

    const result = await db.execute({
      sql: query,
      args
    });

    const stats = result.rows[0];
    const total = Number(stats.totalAttempts) || 0;
    const passed = Number(stats.passedCount) || 0;
    const failed = Number(stats.failedCount) || 0;

    return NextResponse.json({
      totalAttempts: total,
      passed,
      failed,
      passRate: total > 0 ? Number(((passed / total) * 100).toFixed(2)) : 0,
      failRate: total > 0 ? Number(((failed / total) * 100).toFixed(2)) : 0,
      averageScore: Number((Number(stats.averageScore) || 0).toFixed(2)),
      highestScore: Number(stats.highestScore) || 0,
      lowestScore: Number(stats.lowestScore) || 0,
      averageSuccessRate: total > 0 ? Number(((passed / total) * 100).toFixed(2)) : 0
    });

  } catch (error) {
    console.error("Outcome Metrics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
