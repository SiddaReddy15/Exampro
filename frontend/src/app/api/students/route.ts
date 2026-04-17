import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM users WHERE role = 'STUDENT' ORDER BY created_at DESC");
    const students = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
      createdAt: row.created_at,
      lastActive: row.last_active,
      profilePhoto: row.profile_photo,
    }));

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
