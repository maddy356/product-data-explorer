import { Pool } from 'pg';

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}` +
      `@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT ?? 5432}/${process.env.POSTGRES_DB}`,
  ssl:
    (process.env.DB_SSL ?? '').toLowerCase() === 'true' ||
    (process.env.DATABASE_URL ?? '').includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined,
});
