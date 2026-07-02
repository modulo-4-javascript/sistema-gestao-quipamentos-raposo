import { Pool } from "pg";

import { databaseConfig, isDatabaseEnabled } from "./config";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!isDatabaseEnabled() || !databaseConfig.url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: databaseConfig.url,
      ssl: databaseConfig.ssl
    });
  }

  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
