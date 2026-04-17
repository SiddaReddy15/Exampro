const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const result = dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL || "",
  authToken: process.env.DATABASE_AUTH_TOKEN || "",
});

async function check() {
  try {
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables:", tables.rows.map(r => r.name));

    for (const table of tables.rows) {
        const tableName = table.name;
        if (tableName.startsWith('_')) continue;
        const count = await client.execute(`SELECT COUNT(*) as c FROM ${tableName}`);
        console.log(`Table ${tableName}: ${count.rows[0].c} rows`);
        if (count.rows[0].c > 0) {
            const first = await client.execute(`SELECT * FROM ${tableName} LIMIT 1`);
            console.log(`Sample from ${tableName}:`, JSON.stringify(first.rows[0]));
        }
    }
  } catch (e) {
    console.error(e);
  }
}

check();
