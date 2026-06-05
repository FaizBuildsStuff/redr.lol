import { NextRequest, NextResponse } from "next/server";
import { sql, initDb } from "@/lib/db";
import { cookies } from "next/headers";
import { createToken, verifyToken } from "@/lib/session";

function popupRedirect(req: NextRequest, dest: string) {
  return NextResponse.redirect(new URL(`/api/auth/popup-callback?dest=${encodeURIComponent(dest)}`, req.url));
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const stateParam = searchParams.get("state");

  let state = { action: "login" };
  try {
    if (stateParam) state = JSON.parse(decodeURIComponent(stateParam));
  } catch (e) {}

  if (error) {
    if (state.action === "connect") {
      return popupRedirect(req, "/dashboard/settings?error=google_auth_denied");
    }
    return popupRedirect(req, "/signin?error=google_auth_denied");
  }

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "Google OAuth configuration missing" }, { status: 500 });
  }

  try {
    // Ensure DB schema is up to date before making updates
    await initDb();

    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
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
      console.error("Google Token Error:", tokenData);
      return popupRedirect(req, "/signin?error=google_token_error");
    }

    // Fetch user info from Google using access token
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userResponse.json();

    if (!googleUser || !googleUser.id || !googleUser.email) {
      return popupRedirect(req, "/signin?error=google_user_fetch_failed");
    }

    const cookieStore = await cookies();

    // CONNECT FLOW
    if (state.action === "connect") {
      const session = verifyToken(cookieStore.get("session")?.value);
      if (!session || !session.userId) {
        return popupRedirect(req, "/signin?redirect=/api/auth/google/login?action=connect");
      }

      await sql`
        UPDATE users 
        SET 
          google_id = ${googleUser.id},
          google_avatar = ${googleUser.picture || null},
          google_access_token = ${tokenData.access_token},
          google_refresh_token = ${tokenData.refresh_token || null}
        WHERE id = ${session.userId}
      `;

      // Always redirect back to settings — the user is already logged in and onboarded
      return popupRedirect(req, "/dashboard/settings?success=google_connected");
    }

    // LOGIN / SIGNUP FLOW
    const [existingUser] = await sql`SELECT * FROM users WHERE email = ${googleUser.email}`;

    let userId = null;
    let username = "";
    
    if (existingUser) {
      userId = existingUser.id;
      username = existingUser.username;
      
      // Update Google info if not set
      await sql`
        UPDATE users 
        SET 
          google_id = ${googleUser.id},
          google_avatar = COALESCE(google_avatar, ${googleUser.picture || null}),
          google_access_token = ${tokenData.access_token},
          google_refresh_token = COALESCE(${tokenData.refresh_token || null}, google_refresh_token)
        WHERE id = ${userId}
      `;
    } else {
      // Create new user
      // Generate a unique username
      let baseUsername = googleUser.email.split('@')[0].replace(/[^a-z0-9_-]/g, "").toLowerCase().slice(0, 20);
      if (!baseUsername || baseUsername.length < 3) baseUsername = "user";
      
      let newUsername = baseUsername;
      let counter = 1;
      let isUnique = false;
      
      while (!isUnique) {
        const [check] = await sql`SELECT id FROM users WHERE username = ${newUsername}`;
        if (!check) {
          isUnique = true;
        } else {
          newUsername = `${baseUsername}${counter}`;
          counter++;
        }
      }
      
      username = newUsername;
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);

      const [newUser] = await sql`
        INSERT INTO users (username, email, password, google_id, google_avatar, google_access_token, google_refresh_token)
        VALUES (${username}, ${googleUser.email}, ${randomPassword}, ${googleUser.id}, ${googleUser.picture || null}, ${tokenData.access_token}, ${tokenData.refresh_token || null})
        RETURNING id
      `;
      userId = newUser.id;
    }

    // Create session
    const sessionToken = createToken({
      userId,
      username,
      email: googleUser.email,
    });

    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    const [finalUser] = await sql`SELECT onboarding_completed FROM users WHERE id = ${userId}`;

    if (!finalUser.onboarding_completed) {
      return popupRedirect(req, "/onboarding");
    }

    return popupRedirect(req, "/dashboard");
    
  } catch (err) {
    console.error("Google OAuth Error:", err);
    return popupRedirect(req, "/signin?error=google_internal_error");
  }
}
