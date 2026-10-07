import { Pool } from "pg";
import { env } from "../../config/env";

export const pool = new Pool({
  connectionString: env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false }, 
});