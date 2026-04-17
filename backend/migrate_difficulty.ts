import { db } from "./src/config/db";

async function migrate() {
    try {
        await db.execute("ALTER TABLE questions ADD COLUMN difficulty TEXT CHECK(difficulty IN ('EASY', 'MEDIUM', 'HARD')) DEFAULT 'MEDIUM'");
        console.log("Migration successful: Added difficulty column to questions.");
    } catch (e: any) {
        if (e.message.includes("duplicate column name")) {
            console.log("Column already exists.");
        } else {
            console.error("Migration failed:", e);
        }
    }
    process.exit(0);
}

migrate();
