import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subDays, subMonths, format, eachDayOfInterval, parseISO } from "date-fns";

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

    // Unified aggregation query
    const trendQuery = `
      SELECT 
        date(a.submit_time) as date,
        AVG(a.score) as avgScore,
        MAX(a.score) as maxScore,
        MIN(a.score) as minScore,
        COUNT(CASE WHEN a.score >= e.passing_score THEN 1 END) as passed,
        COUNT(CASE WHEN a.score < e.passing_score THEN 1 END) as failed
      FROM attempts a
      JOIN exams e ON a.exam_id = e.id
      WHERE a.submit_time >= ? AND a.status = 'SUBMITTED'
      ${examId ? "AND a.exam_id = ?" : ""}
      GROUP BY date(a.submit_time)
      ORDER BY date ASC
    `;

    const args: any[] = [startDateStr];
    if (examId) args.push(examId);

    const result = await db.execute({
      sql: trendQuery,
      args
    });

    const interval = eachDayOfInterval({ start: startDate, end: now });
    const dataMap = new Map();
    
    result.rows.forEach((row: any) => {
      dataMap.set(row.date, {
        averageScore: Math.round(Number(row.avgScore) || 0),
        highestScore: Number(row.maxScore) || 0,
        lowestScore: Number(row.minScore) || 0,
        passCount: Number(row.passed) || 0,
        failCount: Number(row.failed) || 0,
      });
    });

    const trend = interval.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const dayData = dataMap.get(dateKey) || {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passCount: 0,
        failCount: 0,
      };
      return {
        date: dateKey,
        ...dayData
      };
    });

    // Summary calculation
    const totalAttempts = trend.reduce((acc, curr) => acc + curr.passCount + curr.failCount, 0);
    const totalPassed = trend.reduce((acc, curr) => acc + curr.passCount, 0);
    const avgOverall = totalAttempts > 0 
      ? Math.round(trend.reduce((acc, curr) => acc + (curr.averageScore * (curr.passCount + curr.failCount)), 0) / totalAttempts) 
      : 0;

    return NextResponse.json({
      trend,
      summary: {
        averageScore: avgOverall,
        passRate: totalAttempts > 0 ? Math.round((totalPassed / totalAttempts) * 100) : 0,
        totalAttempts
      }
    });

  } catch (error) {
    console.error("Performance API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
