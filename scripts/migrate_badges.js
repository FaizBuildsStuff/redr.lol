const fs = require('fs');

function loadEnv() {
  const envPath = 'e:\\Programming Projects\\redrose\\.env';
  if (!fs.existsSync(envPath)) return;
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[match[1]] = value;
    }
  });
}

async function run() {
  loadEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    return;
  }
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(databaseUrl);
    console.log("Adding owned_badges...");
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS owned_badges JSONB DEFAULT '[]'::jsonb;`;
    console.log("Success! owned_badges added.");
  } catch (error) {
    console.error("Error:", error);
  }
}
run();
