import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "../schema/schema.js";

neonConfig.fetchConnectionCache = true;
config({ path: ".env" });

let dbInstance = null;

export async function connectToDB() {
  if (dbInstance) return dbInstance; 

  try {
    const sql = neon(process.env.DATABASE_URL);
    dbInstance = drizzle(sql, { schema });

    await sql`SELECT 1`;
    console.log("Connected to Neon DB");

    return dbInstance;
  } catch (e) {
    console.error("Error connecting to Neon DB:", e);
    throw e;
  }
}
