import { neon } from '@neondatabase/serverless';

export type DatabaseRow = Record<string, unknown>;
export type DatabaseClient = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<DatabaseRow[]>;

let databaseClient: DatabaseClient | undefined;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase(): DatabaseClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  databaseClient ??= neon(connectionString) as unknown as DatabaseClient;
  return databaseClient;
}
