import { existsSync, readFileSync, writeFileSync } from "node:fs";
import process from "node:process";

const envPath = ".env";
const managedValues = {
  PORT: process.env.PORT ?? "3000",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  POSTGRES_DB: process.env.POSTGRES_DB ?? "denkenhub",
  POSTGRES_USER: process.env.POSTGRES_USER ?? "denkenhub",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? "denkenhub123",
  POSTGRES_PORT: process.env.POSTGRES_PORT ?? "15432"
};

const managedKeys = Object.keys(managedValues);
const currentContent = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const lines = currentContent ? currentContent.split(/\r?\n/) : [];

if (lines.at(-1) === "") {
  lines.pop();
}

const seenKeys = new Set();
const nextLines = lines.map((line) => {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);

  if (!match) {
    return line;
  }

  const key = match[1];

  if (!Object.prototype.hasOwnProperty.call(managedValues, key)) {
    return line;
  }

  seenKeys.add(key);
  return `${key}=${managedValues[key]}`;
});

for (const key of managedKeys) {
  if (!seenKeys.has(key)) {
    nextLines.push(`${key}=${managedValues[key]}`);
  }
}

writeFileSync(envPath, `${nextLines.join("\n")}\n`);
