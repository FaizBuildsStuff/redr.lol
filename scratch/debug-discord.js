require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function check() {
  const username = process.argv[2] || 'max';
  const rows = await sql`
    SELECT id, username, discord_id, 
      CASE WHEN discord_access_token IS NOT NULL THEN 'SET' ELSE 'NULL' END as access_token,
      CASE WHEN discord_refresh_token IS NOT NULL THEN 'SET' ELSE 'NULL' END as refresh_token,
      discord_access_token, discord_refresh_token
    FROM users WHERE LOWER(TRIM(username)) = ${username.toLowerCase()} LIMIT 1
  `;
  
  if (!rows.length) { console.log('User not found'); return; }
  const user = rows[0];
  
  console.log('\n=== DB Record ===');
  console.log('id:', user.id);
  console.log('username:', user.username);
  console.log('discord_id:', user.discord_id);
  console.log('access_token:', user.access_token);
  console.log('refresh_token:', user.refresh_token);

  if (!user.discord_id) { console.log('\nNo discord_id — not connected'); return; }

  // Test 1: dcdn proxy
  console.log('\n=== Test 1: dcdn.dstn.to proxy ===');
  const proxyRes = await fetch(`https://dcdn.dstn.to/profile/${user.discord_id}`, { cache: 'no-store' });
  const proxyBody = await proxyRes.json();
  console.log('Status:', proxyRes.status);
  console.log('Has user field:', !!proxyBody.user);
  if (proxyBody.user) {
    console.log('Username:', proxyBody.user.username);
    console.log('Global name:', proxyBody.user.global_name);
  } else {
    console.log('Body:', JSON.stringify(proxyBody));
  }

  // Test 2: OAuth token
  if (user.discord_access_token) {
    console.log('\n=== Test 2: OAuth /users/@me ===');
    const meRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${user.discord_access_token}` }
    });
    console.log('Status:', meRes.status);
    if (meRes.ok) {
      const me = await meRes.json();
      console.log('Username:', me.username, '| Global:', me.global_name);
    } else {
      const err = await meRes.json().catch(() => ({}));
      console.log('Error:', JSON.stringify(err));
    }
  }

  // Test 3: Bot token
  console.log('\n=== Test 3: Bot token /users/:id ===');
  const botRes = await fetch(`https://discord.com/api/v10/users/${user.discord_id}`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
  });
  console.log('Status:', botRes.status);
  if (botRes.ok) {
    const bot = await botRes.json();
    console.log('Username:', bot.username, '| Global:', bot.global_name);
    console.log('Avatar:', bot.avatar);
  } else {
    const err = await botRes.json().catch(() => ({}));
    console.log('Error:', JSON.stringify(err));
  }

  // Test 4: Lanyard
  if (user.discord_id) {
    console.log('\n=== Test 4: Lanyard REST ===');
    const lanyardRes = await fetch(`https://api.lanyard.rest/v1/users/${user.discord_id}`);
    console.log('Status:', lanyardRes.status);
    const lanyardBody = await lanyardRes.json();
    if (lanyardBody.success) {
      console.log('Discord status:', lanyardBody.data.discord_status);
      console.log('Online:', lanyardBody.data.discord_status !== 'offline');
    } else {
      console.log('Error:', JSON.stringify(lanyardBody));
    }
  }
}

check().catch(console.error);
