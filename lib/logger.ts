import { sql } from "./db";

/**
 * Logs a system event.
 * @param action - The action taking place (e.g., 'user_login', 'role_changed')
 * @param details - Any contextual JSON data
 * @param actorId - The ID of the user performing the action (null if system)
 * @param targetId - The ID of the user being affected (null if none)
 */
export async function logSystemEvent(
  action: string,
  details: Record<string, any> = {},
  actorId: number | null = null,
  targetId: number | null = null
) {
  try {
    await sql`
      INSERT INTO system_logs (actor_id, target_id, action, details)
      VALUES (${actorId}, ${targetId}, ${action}, ${JSON.stringify(details)}::jsonb)
    `;
  } catch (error) {
    console.error("Failed to log system event:", error);
  }
}
