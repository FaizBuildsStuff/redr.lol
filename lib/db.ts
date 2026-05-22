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
        discord_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS discord_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS discord_access_token TEXT,
      ADD COLUMN IF NOT EXISTS discord_refresh_token TEXT,
      ADD COLUMN IF NOT EXISTS typewriter_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS typewriter_quotes JSONB,
      ADD COLUMN IF NOT EXISTS custom_links JSONB,
      ADD COLUMN IF NOT EXISTS active_badges JSONB,
      ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'crimson-dither',
      ADD COLUMN IF NOT EXISTS music_active BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS sparkles_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS custom_font VARCHAR(50) DEFAULT 'Satoshi';
    `;
    console.log("Database schema initialized successfully.");
  } catch (error) {
    console.error("Error during database schema initialization:", error);
    throw error;
  }
}
