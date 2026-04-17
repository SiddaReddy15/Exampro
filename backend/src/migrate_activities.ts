import { db } from "./config/db";
import { randomUUID } from "crypto";

async function seedActivities() {
    try {
        console.log("Creating activities table...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS activities (
                id TEXT PRIMARY KEY,
                user_name TEXT NOT NULL,
                user_role TEXT NOT NULL,
                action TEXT NOT NULL,
                entity_type TEXT NOT NULL,
                entity_title TEXT,
                status TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Seeding activities...");
        const activities = [
            {
                user_name: "Pranay",
                user_role: "ADMIN",
                action: "Created Exam",
                entity_type: "Exam",
                entity_title: "Core JavaScript Assessment",
                status: "Success",
            },
            {
                user_name: "Rahul Sharma",
                user_role: "STUDENT",
                action: "Attempted Exam",
                entity_type: "Exam",
                entity_title: "Modern World Quiz",
                status: "Completed",
            },
            {
                user_name: "Admin",
                user_role: "ADMIN",
                action: "Added Question",
                entity_type: "Question",
                entity_title: "React useState Hook",
                status: "Success",
            },
            {
                user_name: "Sneha Reddy",
                user_role: "STUDENT",
                action: "Registered",
                entity_type: "Student",
                entity_title: "ExamPro Platform",
                status: "Success",
            }
        ];

        for (const activity of activities) {
            await db.execute({
                sql: `INSERT INTO activities (id, user_name, user_role, action, entity_type, entity_title, status) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [randomUUID(), activity.user_name, activity.user_role, activity.action, activity.entity_type, activity.entity_title, activity.status]
            });
        }
        console.log("Seeding complete.");
    } catch (error) {
        console.error("Migration/Seeding failed:", error);
    }
}

seedActivities();
