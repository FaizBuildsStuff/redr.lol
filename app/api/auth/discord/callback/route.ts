import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

function getBadgesFromFlags(flags: number, premiumType: number) {
  const badges = [];
  if (premiumType > 0) badges.push({ id: "nitro", icon: "2ba85e8026a8614b640c2837bcdfe21b", description: "Subscriber" });
  if (flags & (1 << 0)) badges.push({ id: "staff", icon: "8a88d63823caa720d2cb2a014a66db11", description: "Discord Staff" });
  if (flags & (1 << 1)) badges.push({ id: "partner", icon: "3f9748e53446a137a052f3454e22fd97", description: "Partnered Server Owner" });
  if (flags & (1 << 2)) badges.push({ id: "hypesquad", icon: "3140e01476b701bc24f7f62da6cc4fa4", description: "HypeSquad Events" });
  if (flags & (1 << 3)) badges.push({ id: "bug_hunter_level_1", icon: "2717692c7dca7289b35293e2fcb7096c", description: "Discord Bug Hunter" });
  if (flags & (1 << 6)) badges.push({ id: "hypesquad_house_1", icon: "8a88d63823caa720d2cb2a014a66db11", description: "HypeSquad Bravery" }); 
  if (flags & (1 << 7)) badges.push({ id: "hypesquad_house_2", icon: "011940fd013da3f7fb926e4a1cd2e618", description: "HypeSquad Brilliance" });
  if (flags & (1 << 8)) badges.push({ id: "hypesquad_house_3", icon: "3aa41de486fa12454c3761e8e223442e", description: "HypeSquad Balance" });
  if (flags & (1 << 9)) badges.push({ id: "premium_early_supporter", icon: "7060786766c9c840eb3019e725d2b358", description: "Early Supporter" });
  if (flags & (1 << 14)) badges.push({ id: "bug_hunter_level_2", icon: "848f79194d4bef5fc7f8d3d5f47ccbb0", description: "Discord Bug Hunter Level 2" });
  if (flags & (1 << 17)) badges.push({ id: "early_verified_bot_developer", icon: "6df5892e0f35b051f8b61eace34f4967", description: "Early Verified Bot Developer" });
  if (flags & (1 << 22)) badges.push({ id: "active_developer", icon: "cb8c0a6b7e21fa750fbffcc377eb9de8", description: "Active Developer" });
  return badges;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const stateParam = searchParams.get("state");

  // Parse optional state so we know where to redirect after success/failure
  let fromSettings = false;
  try {
    if (stateParam) {
      const parsed = JSON.parse(decodeURIComponent(stateParam));
      fromSettings = parsed?.from === "settings";
    }
  } catch {}

  const successDest = fromSettings
    ? "/dashboard/settings?success=discord_connected"
    : "/dashboard/customize?success=discord_connected";
  const errorBase = fromSettings ? "/dashboard/settings" : "/dashboard/customize";

  if (error) {
    return NextResponse.redirect(new URL(`${errorBase}?error=discord_auth_denied`, req.url));
  }

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Discord OAuth configuration missing" }, { status: 500 });
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
      return NextResponse.redirect(new URL(`${errorBase}?error=discord_token_error`, req.url));
    }

    // Fetch Discord user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const discordUser = await userResponse.json();

    if (!discordUser || !discordUser.id) {
      return NextResponse.redirect(new URL(`${errorBase}?error=discord_user_fetch_failed`, req.url));
    }

    // Require an active session (user must already be logged in)
    const cookieStore = await cookies();
    const session = verifyToken(cookieStore.get("session")?.value);
    if (!session || !session.userId) {
      return NextResponse.redirect(new URL("/signin?redirect=/api/auth/discord/login", req.url));
    }

    // Try to fetch extended profile using bot token fallback or proxies
    let discordBio = null;
    let discordPronouns = null;
    let discordBanner = discordUser.banner || null;
    let discordThemeColors = null;
    let discordBadgesData = getBadgesFromFlags(discordUser.public_flags || 0, discordUser.premium_type || 0);

    try {
      if (process.env.DISCORD_BOT_TOKEN) {
        const botRes = await fetch(`https://discord.com/api/v10/users/${discordUser.id}`, {
          headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
        });
        if (botRes.ok) {
          const botData = await botRes.json();
          discordBanner = botData.banner || discordBanner;
        }
      }
      
      // Attempt proxy for bio
      const proxyRes = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${discordUser.id}`, { cache: "no-store" });
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        discordBio = proxyData.bio || discordBio;
        discordBanner = proxyData.banner?.id || discordBanner;
        discordThemeColors = proxyData.banner?.color ? [parseInt(proxyData.banner.color.replace("#", ""), 16)] : null;
      }
    } catch (err) {
      console.log("Proxy profile fetch failed, using fallback @me details.");
    }

    // Ensure db is updated with the new discord profile columns
    const { initDb } = await import("@/lib/db");
    await initDb();

    await sql`
      UPDATE users
      SET
        discord_id = ${discordUser.id},
        discord_avatar = ${discordUser.avatar || null},
        discord_access_token = ${tokenData.access_token},
        discord_refresh_token = ${tokenData.refresh_token},
        discord_bio = ${discordBio},
        discord_pronouns = ${discordPronouns},
        discord_banner = ${discordBanner},
        discord_theme_colors = ${discordThemeColors ? JSON.stringify(discordThemeColors) : null},
        discord_badges_data = ${JSON.stringify(discordBadgesData)}
      WHERE id = ${session.userId}
    `;

    // If the flow came from the settings page, always return there
    if (fromSettings) {
      return NextResponse.redirect(new URL(successDest, req.url));
    }

    // Legacy: only divert to onboarding if the user hasn't finished it yet
    const [dbUser] = await sql`
      SELECT onboarding_completed FROM users WHERE id = ${session.userId}
    `;

    if (dbUser && !dbUser.onboarding_completed) {
      return NextResponse.redirect(new URL("/onboarding?success=discord_connected", req.url));
    }

    return NextResponse.redirect(new URL(successDest, req.url));
  } catch (err) {
    console.error("Discord OAuth Error:", err);
    return NextResponse.redirect(new URL(`${errorBase}?error=discord_internal_error`, req.url));
  }
}
