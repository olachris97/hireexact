import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export async function query<T extends Record<string, any> = any>(text: string, params: any[] = []) {
  const result = await pool.query<T>(text, params);
  return result;
}
