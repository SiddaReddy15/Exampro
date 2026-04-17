const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || "",
  authToken: process.env.DATABASE_AUTH_TOKEN || "",
});

async function check() {
  try {
    const students = await client.execute("SELECT * FROM users WHERE role = 'STUDENT'");
    console.log(`Found ${students.rows.length} students`);
    if (students.rows.length > 0) {
        console.log("Sample student:", JSON.stringify(students.rows[0]));
    }
  } catch (e) {
    console.error(e);
  }
}

check();
