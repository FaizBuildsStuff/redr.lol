import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { initDb } = await import("../lib/db");
  await initDb();
  console.log("Done");
  process.exit(0);
}
main();
