import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard/customize?error=discord_auth_denied", req.url));
  }

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "Discord OAuth configuration missing" }, { status: 500 });
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Discord Token Error:", tokenData);
      return NextResponse.redirect(new URL("/dashboard/customize?error=discord_token_error", req.url));
    }

    // Fetch user info from Discord using access token
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const discordUser = await userResponse.json();

    if (!discordUser || !discordUser.id) {
      return NextResponse.redirect(new URL("/dashboard/customize?error=discord_user_fetch_failed", req.url));
    }

    // Associate with logged-in user
    const cookieStore = await cookies();
    const session = verifyToken(cookieStore.get("session")?.value);
    if (!session || !session.userId) {
      return NextResponse.redirect(new URL("/signin?redirect=/api/auth/discord/login", req.url));
    }

    await sql`
      UPDATE users 
      SET 
        discord_id = ${discordUser.id},
        discord_access_token = ${tokenData.access_token},
        discord_refresh_token = ${tokenData.refresh_token}
      WHERE id = ${session.userId}
    `;

    // Successfully connected
    return NextResponse.redirect(new URL("/dashboard/customize?success=discord_connected", req.url));
    
  } catch (err) {
    console.error("Discord OAuth Error:", err);
    return NextResponse.redirect(new URL("/dashboard/customize?error=discord_internal_error", req.url));
  }
}
