import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await db.execute({
      sql: "DELETE FROM questions WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete API Error:", error);
    return NextResponse.json(
      { success: false, error: `Delete failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Mapping frontend fields to database columns
    await db.execute({
      sql: `UPDATE questions SET 
        question_text = ?, 
        options = ?, 
        correct_answer = ?, 
        difficulty = ?, 
        marks = ?,
        starter_code = ?,
        test_cases = ?,
        constraints = ?
        WHERE id = ?`,
      args: [
        body.questionText || body.question_text,
        body.options ? JSON.stringify(body.options) : null,
        body.correctAnswer || body.correct_answer || null,
        body.difficulty || "MEDIUM",
        Number(body.marks) || 1,
        body.starterCode || body.starter_code || null,
        body.testCases ? JSON.stringify(body.testCases) : (body.test_cases ? (typeof body.test_cases === 'string' ? body.test_cases : JSON.stringify(body.test_cases)) : null),
        body.constraints || null,
        id
      ],
    });

    // Fetch the updated question to return it
    const result = await db.execute({
        sql: "SELECT * FROM questions WHERE id = ?",
        args: [id]
    });

    return NextResponse.json({ 
        success: true, 
        data: result.rows[0] 
    });
  } catch (error: any) {
    console.error("Update API Error:", error);
    return NextResponse.json(
      { success: false, error: `Update failed: ${error.message}` },
      { status: 500 }
    );
  }
}
