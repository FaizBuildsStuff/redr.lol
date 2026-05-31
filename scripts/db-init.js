const fs = require('fs');
const path = require('path');

// Manually parse .env file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found.');
    return;
  }
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if any
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

async function run() {
  loadEnv();
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }
  
  console.log("Connecting to Neon DB...");
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(databaseUrl);
    
    console.log("Creating 'users' table if it doesn't exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating 'daily_analytics' table if it doesn't exist...");
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

    console.log("Adding analytics columns if they don't exist...");
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS profile_clicks INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS link_clicks INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS devices JSONB DEFAULT '{"desktop": 0, "mobile": 0, "tablet": 0}'::jsonb,
      ADD COLUMN IF NOT EXISTS referrers JSONB DEFAULT '{}'::jsonb;
    `;
    console.log("Database initialized successfully! 'users' table is now ready.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

run();
