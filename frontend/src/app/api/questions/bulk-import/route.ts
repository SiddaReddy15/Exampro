import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json({ error: "Only Excel files (.xlsx, .xls) are supported" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false,
    });

    if (!rows.length) {
      return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
    }

    const statements: any[] = [];
    const processedQuestions: any[] = [];

    for (const row of rows) {
        const qText = row.questionText || row.question_text;
        if (!qText) continue;

        let parsedOptions = null;
        if (row.options) {
            try {
                parsedOptions = typeof row.options === 'string' ? JSON.parse(row.options) : row.options;
            } catch (e) {
                parsedOptions = String(row.options).split(",").map((s: string) => s.trim());
            }
        }

        let parsedTestCases = null;
        if (row.testCases || row.test_cases) {
            const rawTC = row.testCases || row.test_cases;
            parsedTestCases = typeof rawTC === 'string' ? JSON.parse(rawTC) : rawTC;
        }

        const id = (globalThis as any).crypto?.randomUUID?.() || Math.random().toString(36).substring(2);
        
        statements.push({
            sql: `INSERT INTO questions (
                id, category_id, type, title, question_text, options, 
                correct_answer, difficulty, marks, languages, test_cases
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                id,
                String(row.category || "general").trim().toLowerCase(),
                String(row.type || "MCQ").trim().toUpperCase(),
                row.title || null,
                String(qText),
                parsedOptions ? JSON.stringify(parsedOptions) : null,
                row.correctAnswer || row.correct_answer || null,
                String(row.difficulty || "MEDIUM").toUpperCase(),
                Number(row.marks || 1),
                row.languages ? JSON.stringify(row.languages) : null,
                parsedTestCases ? JSON.stringify(parsedTestCases) : null
            ]
        });
        processedQuestions.push(id);
    }

    if (statements.length > 0) {
        await db.batch(statements, "write");
    }

    return NextResponse.json({
      success: true,
      message: "Questions imported successfully",
      count: processedQuestions.length,
    });
  } catch (error: any) {
    console.error("Bulk Import Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import questions." },
      { status: 500 }
    );
  }
}

