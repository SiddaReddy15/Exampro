import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL || "",
  authToken: process.env.DATABASE_AUTH_TOKEN || "",
});

async function check() {
  try {
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables:", tables.rows.map(r => r.name));

    for (const table of tables.rows) {
        const count = await client.execute(`SELECT COUNT(*) as c FROM ${table.name}`);
        console.log(`Table ${table.name}: ${count.rows[0].c} rows`);
        if (count.rows[0].c > 0) {
            const first = await client.execute(`SELECT * FROM ${table.name} LIMIT 1`);
            console.log(`Sample from ${table.name}:`, first.rows[0]);
        }
    }
  } catch (e) {
    console.error(e);
  }
}

check();
