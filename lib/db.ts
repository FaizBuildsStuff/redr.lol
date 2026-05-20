import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined.");
}

export const sql = neon(process.env.DATABASE_URL);

/**
 * Ensures the required tables exist in Neon DB.
 * It will run a DDL query to create the `users` table if it's not present.
 */
export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Database schema initialized successfully.");
  } catch (error) {
    console.error("Error during database schema initialization:", error);
    throw error;
  }
}
