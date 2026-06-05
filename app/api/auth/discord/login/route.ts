import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`);
  const scope = encodeURIComponent("identify connections");

  if (!clientId || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: "Missing Discord configuration" }, { status: 500 });
  }

  // Forward any ?from= query param in the state so the callback knows where to redirect
  const from = req.nextUrl.searchParams.get("from") || "customize";
  const state = encodeURIComponent(JSON.stringify({ from }));

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;

  return NextResponse.redirect(discordAuthUrl);
}
