import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subDays, subMonths, format, startOfDay, eachDayOfInterval } from "date-fns";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7d";

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

    // Format date for SQLite/LibSQL query
    const startDateStr = format(startDate, "yyyy-MM-dd HH:mm:ss");

    const query = `
      SELECT 
        date(submit_time) as date,
        COUNT(*) as attempts
      FROM attempts
      WHERE submit_time >= ? AND status = 'SUBMITTED'
      GROUP BY date(submit_time)
      ORDER BY date ASC
    `;

    const result = await db.execute({
      sql: query,
      args: [startDateStr]
    });

    // Fill in missing dates with zero attempts
    const interval = eachDayOfInterval({
      start: startDate,
      end: now,
    });

    const dataMap = new Map();
    result.rows.forEach((row: any) => {
      dataMap.set(row.date, Number(row.attempts));
    });

    const formattedData = interval.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      return {
        date: dateKey,
        attempts: dataMap.get(dateKey) || 0,
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Failed to fetch attempt trajectory:", error);
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 });
  }
}
