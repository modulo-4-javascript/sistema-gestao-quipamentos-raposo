import dotenv from "dotenv";

dotenv.config();

export function isDatabaseEnabled(): boolean {
  return process.env.NODE_ENV !== "test" && Boolean(process.env.DATABASE_URL);
}

export const databaseConfig = {
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false
};
