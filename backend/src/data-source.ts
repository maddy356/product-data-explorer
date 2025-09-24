import 'dotenv/config';
import { DataSource } from 'typeorm';

// NOTE: Keep .js extensions if you are using ESM/NodeNext and compile to .js
import { Categories } from './modules/categories/category.entity.js';
import { Navigation } from './modules/navigation/navigation.entity.js';
import { Product } from './modules/products/product.entity.js';

/**
 * Build DB URL from environment. Prefer DATABASE_URL.
 * Fallback to discrete POSTGRES_* vars for local dev if needed.
 */
const url =
  process.env.DATABASE_URL ??
  `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || ''}` +
    `@${process.env.POSTGRES_HOST || '127.0.0.1'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'product_data_explorer'}`;

const useSsl =
  (process.env.DB_SSL ?? '').toLowerCase() === 'true' ||
  (url ?? '').includes('sslmode=require');

/**
 * In production (Render), set:
 *   synchronize: false  (use migrations)
 * In local dev, you can temporarily set TYPEORM_SYNC=true to let TypeORM create tables.
 */
const synchronize =
  (process.env.TYPEORM_SYNC ?? '').toLowerCase() === 'true';

const isProd = (process.env.NODE_ENV ?? '').toLowerCase() === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  entities: [Product, Categories, Navigation],
  // Use compiled migrations in prod, TS sources in dev
  migrations: isProd ? ['dist/migration/*.js'] : ['src/migration/*.ts'],
  // Avoid schema drift in prod
  synchronize,
  // Toggle verbose SQL logging via env (LOG_SQL=true)
  logging: (process.env.LOG_SQL ?? '').toLowerCase() === 'true',
  subscribers: [],
});

// If you use the TypeORM CLI, it expects a default export sometimes:
// export default AppDataSource;