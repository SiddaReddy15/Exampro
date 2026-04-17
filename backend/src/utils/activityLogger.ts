import { db } from "../config/db";
import { generateId } from "./idGenerator";

export const logActivity = async (userId: string, action: string, details: string, status: string = "SUCCESS") => {
    try {
        const id = generateId();
        await db.execute({
            sql: "INSERT INTO activity_log (id, user_id, action, details, status) VALUES (?, ?, ?, ?, ?)",
            args: [id, userId, action, details, status]
        });
        console.log(`Activity Logged: ${action} by ${userId}`);
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};
