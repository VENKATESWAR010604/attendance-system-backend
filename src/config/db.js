import pkg from "pg";
const { Pool } = pkg;

// ✅ Debug (check if .env is loaded)
console.log("DB URL:", process.env.DATABASE_URL);

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});