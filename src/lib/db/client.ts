import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DbClient = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var cfmDbClient: DbClient | undefined;
  var cfmPostgresClient: ReturnType<typeof postgres> | undefined;
}

export function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL);
}

export function createDbClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!globalThis.cfmPostgresClient) {
    globalThis.cfmPostgresClient = postgres(process.env.DATABASE_URL, {
      prepare: false,
    });
  }

  if (!globalThis.cfmDbClient) {
    globalThis.cfmDbClient = drizzle(globalThis.cfmPostgresClient, { schema });
  }

  return globalThis.cfmDbClient;
}

export function getRequiredDbClient() {
  const db = createDbClient();

  if (!db) {
    throw new Error("Database configuration is missing. Set DATABASE_URL.");
  }

  return db;
}

export async function closeDbClient() {
  if (globalThis.cfmPostgresClient) {
    await globalThis.cfmPostgresClient.end();
    globalThis.cfmPostgresClient = undefined;
    globalThis.cfmDbClient = undefined;
  }
}
