import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL?.replace("libsql://", "https://") || "";
const authToken = process.env.DATABASE_AUTH_TOKEN || "";

export const db = createClient({
  url: url,
  authToken: authToken,
});
