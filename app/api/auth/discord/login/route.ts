import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`);
  // Scopes for reading user identity and connections
  const scope = encodeURIComponent("identify connections");
  
  if (!clientId || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: "Missing Discord configuration" }, { status: 500 });
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  return NextResponse.redirect(discordAuthUrl);
}
