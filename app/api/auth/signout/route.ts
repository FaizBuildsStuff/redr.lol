import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Delete HttpOnly session cookie
  response.cookies.set("session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  // Delete client-accessible is_logged_in cookie
  response.cookies.set("is_logged_in", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}

// Support GET requests as well for simple links if needed
export async function GET() {
  return POST();
}
