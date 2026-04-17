const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../frontend/.env' });

const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN
});

async function run() {
    try {
        const password = 'student123';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashing "student123" ->', hashedPassword);
        
        const match = await bcrypt.compare(password, hashedPassword);
        console.log('Immediate match test:', match);

        await client.execute({
            sql: "UPDATE users SET password = ? WHERE role = 'STUDENT'",
            args: [hashedPassword]
        });
        console.log('Updated all students.');
    } catch (e) {
        console.error(e);
    }
}

run();
