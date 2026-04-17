import { db } from "./src/config/db";
import crypto from "crypto";

async function migrate() {
    try {
        console.log("Starting Category Migration...");
        
        // Add Category Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                slug TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Update Questions Table (LibSQL doesn't support adding multiple columns/references easily in one go)
        const columns = [
            "category_id TEXT REFERENCES categories(id) ON DELETE SET NULL",
            "title TEXT",
            "languages TEXT",
            "starter_code TEXT",
            "test_cases TEXT"
        ];

        for (const col of columns) {
            try {
                await db.execute(`ALTER TABLE questions ADD COLUMN ${col}`);
            } catch (e) {
                // Ignore if col exists
            }
        }

        // Seed Categories
        const techCategories = [
            {
              slug: "frontend",
              title: "Frontend Development",
              description: "HTML, CSS, JavaScript, React, and Next.js",
            },
            {
              slug: "backend",
              title: "Backend Development",
              description: "Node.js, Express, and REST APIs",
            },
            {
              slug: "database",
              title: "Database Management",
              description: "SQL, MongoDB, Prisma, and Turso",
            },
            {
              slug: "dsa",
              title: "Data Structures & Algorithms",
              description: "Problem-solving and algorithm design",
            },
            {
              slug: "programming",
              title: "Programming Fundamentals",
              description: "Core programming concepts and OOP",
            },
          ];

        for (const cat of techCategories) {
            await db.execute({
                sql: "INSERT OR IGNORE INTO categories (id, slug, name, description) VALUES (?, ?, ?, ?)",
                args: [crypto.randomUUID(), cat.slug, cat.title, cat.description]
            });
        }

        console.log("Migration and Seeding successful.");
    } catch (e: any) {
        console.error("Migration failed:", e);
    }
    process.exit(0);
}

migrate();
