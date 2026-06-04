import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkOwnerAuth, unauthorizedResponse } from "@/lib/owner-auth";
import os from "os";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const [{ total }] = await sql`SELECT COUNT(*)::int AS total FROM users`;
    
    const [{ banned }] = await sql`SELECT COUNT(*)::int AS banned FROM users WHERE banned_until > CURRENT_TIMESTAMP`;

    const activeServers = os.cpus().length || 1;

    // loadAvg on windows might be 0, but it's a real metric
    const loadAvg = os.loadavg();
    const loadPercent = Math.max(0.1, loadAvg[0]).toFixed(2);
    const systemLoad = `${loadPercent}%`;

    return NextResponse.json({
      totalUsers: total || 0,
      bannedUsers: banned || 0,
      activeServers,
      systemLoad,
    });
  } catch (error: any) {
    console.error("Owner stats fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
