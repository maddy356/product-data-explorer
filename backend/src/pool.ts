<<<<<<< HEAD
// src/pool.ts
=======
>>>>>>> 11cee2d0edcd484da38e6037f6a94b79f4643859
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
<<<<<<< HEAD
});
=======
});
>>>>>>> 11cee2d0edcd484da38e6037f6a94b79f4643859
