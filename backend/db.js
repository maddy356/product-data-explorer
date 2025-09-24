import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'product_data_explorer',
  password: 'madhur', // replace with your Postgres password
  port: 5432,
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}
