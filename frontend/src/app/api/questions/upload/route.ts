import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as xlsx from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const categoryName = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
        return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
    }

    const statements: any[] = [];
    let successCount = 0;

    for (const row of data) {
      const qText = row.question_text || row.questionText;
      if (!qText) continue;

      let parsedOptions = null;
      const rawOptions = row.options;
      if (rawOptions) {
          if (typeof rawOptions === 'string') {
              parsedOptions = rawOptions.split(",").map((s: string) => s.trim());
          } else if (Array.isArray(rawOptions)) {
              parsedOptions = rawOptions;
          } else {
              parsedOptions = [String(rawOptions)];
          }
      }

      const rawType = String(row.type || "MCQ").trim().toUpperCase();
      const type = (rawType === "CODING" ? "CODING" : "MCQ");
      const id = (globalThis as any).crypto?.randomUUID?.() || Math.random().toString(36).substring(2);

      statements.push({
          sql: `INSERT INTO questions (
            id, category_id, type, question_text, options, correct_answer, 
            difficulty, marks, title, languages, test_cases
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            id,
            (categoryName || row.category || "frontend").trim().toLowerCase(),
            type,
            String(qText),
            parsedOptions ? JSON.stringify(parsedOptions) : null,
            row.correct_answer || row.correctAnswer || null,
            String(row.difficulty || "MEDIUM").toUpperCase(),
            Number(row.marks) || 1,
            row.title || null,
            row.languages ? JSON.stringify(row.languages) : null,
            row.testCases || row.test_cases ? JSON.stringify(row.testCases || row.test_cases) : null
          ]
      });
      successCount++;
    }

    if (statements.length > 0) {
        await db.batch(statements, "write");
    }

    return NextResponse.json({ 
        message: `${successCount} questions imported successfully`,
        count: successCount 
    });
  } catch (error: any) {
    console.error("Error importing questions:", error);
    return NextResponse.json(
      { error: `Failed to import questions: ${error.message || 'Internal Error'}` },
      { status: 500 }
    );
  }
}

