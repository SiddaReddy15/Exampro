import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryQuery = searchParams.get("category");

    let sql = "SELECT * FROM questions";
    let args: any[] = [];

    if (categoryQuery) {
        sql += " WHERE LOWER(category_id) = ?";
        args.push(categoryQuery.toLowerCase());
    }
    
    // Using id as fallback for order since created_at is missing in the current schema
    sql += " ORDER BY id DESC";

    const result = await db.execute({ sql, args });
    const questions = result.rows.map((row: any) => ({
      id: row.id,
      category: row.category_id,
      category_id: row.category_id,
      type: row.type,
      title: row.title,
      questionText: row.question_text,
      question_text: row.question_text,
      options: row.options ? (typeof row.options === 'string' ? JSON.parse(row.options) : row.options) : null,
      correctAnswer: row.correct_answer,
      correct_answer: row.correct_answer,
      difficulty: row.difficulty,
      marks: row.marks,
      languages: row.languages,
      testCases: row.test_cases,
      test_cases: row.test_cases,
      constraints: row.constraints,
    }));

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
        category, category_id, type, 
        questionText, question_text,
        options, 
        correctAnswer, correct_answer,
        difficulty, marks, title, 
        languages, testCases, test_cases,
        exam_id
    } = body;

    const finalQuestionText = question_text || questionText;
    const finalCorrectAnswer = correct_answer || correctAnswer;
    const finalCategoryId = category_id || category || "general";
    const finalTestCases = test_cases || testCases;
    const finalExamId = exam_id || null;

    const id = (globalThis as any).crypto?.randomUUID?.() || Math.random().toString(36).substring(2);
    await db.execute({
      sql: `INSERT INTO questions (
        id, category_id, type, question_text, options, correct_answer, 
        difficulty, marks, title, languages, test_cases, exam_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        finalCategoryId.toLowerCase(),
        type,
        finalQuestionText,
        options ? (typeof options === 'string' ? options : JSON.stringify(options)) : null,
        finalCorrectAnswer || null,
        difficulty || "MEDIUM",
        Number(marks) || 1,
        title || null,
        languages ? JSON.stringify(languages) : null,
        finalTestCases ? JSON.stringify(finalTestCases) : null,
        finalExamId
      ]
    });

    const question = { id, category, type, questionText };

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

