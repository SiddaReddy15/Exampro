import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subDays, format } from "date-fns";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7";

  try {
    const startDate = subDays(new Date(), Number(range));
    const startDateStr = format(startDate, "yyyy-MM-dd HH:mm:ss");

    const query = `
      SELECT * FROM activities
      WHERE created_at >= ?
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const result = await db.execute({
      sql: query,
      args: [startDateStr]
    });

    // Map snake_case to camelCase for the frontend if needed, 
    // but I'll stick to what the user expects in their component code
    // User expects: userName, userRole, action, entityTitle, createdAt
    const activities = result.rows.map((row: any) => ({
      id: row.id,
      userName: row.user_name,
      userRole: row.user_role,
      action: row.action,
      entityType: row.entity_type,
      entityTitle: row.entity_title,
      status: row.status,
      createdAt: row.created_at,
    }));

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
