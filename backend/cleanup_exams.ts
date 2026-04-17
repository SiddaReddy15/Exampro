import { db } from "./src/config/db";

const TECHNICAL_TITLES = [
  "Frontend Development",
  "Backend Development",
  "Database Management",
  "DevOps & Cloud",
  "DSA & Logic"
];

async function cleanup() {
  console.log("🧹 Cleaning up exams...");
  try {
    const exams = await db.execute("SELECT id, title FROM exams");
    for (const exam of exams.rows) {
      if (!TECHNICAL_TITLES.includes(exam.title as string)) {
        await db.execute({
          sql: "DELETE FROM exams WHERE id = ?",
          args: [exam.id]
        });
        console.log(`🗑️ Deleted legacy exam: ${exam.title}`);
      }
    }
    console.log("✨ Cleanup complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

cleanup();
