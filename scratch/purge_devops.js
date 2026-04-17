const { createClient } = require('@libsql/client');
require('dotenv').config({ path: './backend/.env' });

const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN
});

async function run() {
    try {
        console.log('Force cleaning DevOps...');
        
        // 1. Delete answers linked to DevOps exams
        await client.execute(`
            DELETE FROM answers 
            WHERE attempt_id IN (
                SELECT id FROM attempts 
                WHERE exam_id IN (SELECT id FROM exams WHERE title LIKE '%DevOps%')
            )
        `);

        // 2. Delete attempts linked to DevOps exams
        await client.execute(`
            DELETE FROM attempts 
            WHERE exam_id IN (SELECT id FROM exams WHERE title LIKE '%DevOps%')
        `);

        // 3. Delete questions linked to DevOps exams
        await client.execute(`
            DELETE FROM questions 
            WHERE exam_id IN (SELECT id FROM exams WHERE title LIKE '%DevOps%')
        `);

        // 4. Delete the exams themselves
        await client.execute("DELETE FROM exams WHERE title LIKE '%DevOps%'");

        console.log('DevOps data purged successfully.');
    } catch (e) {
        console.error('Error during purge:', e);
    }
}

run();
