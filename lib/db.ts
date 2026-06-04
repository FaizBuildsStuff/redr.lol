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
      CREATE TABLE IF NOT EXISTS daily_analytics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        views INTEGER DEFAULT 0,
        profile_clicks INTEGER DEFAULT 0,
        link_clicks INTEGER DEFAULT 0,
        UNIQUE(user_id, date)
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
      ADD COLUMN IF NOT EXISTS custom_font VARCHAR(50) DEFAULT 'Satoshi',
      ADD COLUMN IF NOT EXISTS background_url TEXT,
      ADD COLUMN IF NOT EXISTS background_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS audios JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS audio_shuffle BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS audio_player_enabled BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS background_audio_enabled BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS location VARCHAR(255),
      ADD COLUMN IF NOT EXISTS discord_profile_transparency NUMERIC DEFAULT 0.40,
      ADD COLUMN IF NOT EXISTS onboarding_discovery_source VARCHAR(255),
      ADD COLUMN IF NOT EXISTS onboarding_discovery_other TEXT,
      ADD COLUMN IF NOT EXISTS onboarding_planned_use VARCHAR(255),
      ADD COLUMN IF NOT EXISTS onboarding_planned_use_other TEXT,
      ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS profile_clicks INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS link_clicks INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS devices JSONB DEFAULT '{"desktop": 0, "mobile": 0, "tablet": 0}'::jsonb,
      ADD COLUMN IF NOT EXISTS referrers JSONB DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user',
      ADD COLUMN IF NOT EXISTS banned_until TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS timeout_until TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS force_logout_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS discord_avatar VARCHAR(255);
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        target_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(255) NOT NULL,
        details JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Database schema initialized successfully.");
  } catch (error) {
    console.error("Error during database schema initialization:", error);
    throw error;
  }
}
