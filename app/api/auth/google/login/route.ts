import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "login";
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`);
  
  // Scopes for reading user identity (email and profile)
  const scope = encodeURIComponent("openid email profile");
  
  if (!clientId || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: "Missing Google configuration" }, { status: 500 });
  }

  // Pass the action in the state parameter
  const state = encodeURIComponent(JSON.stringify({ action }));

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
  
  return NextResponse.redirect(googleAuthUrl);
}
