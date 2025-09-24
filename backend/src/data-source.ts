import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Categories } from './modules/categories/category.entity.js';
import { Navigation } from './modules/navigation/navigation.entity.js';
import { Product } from './modules/products/product.entity.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'madhur',
  database: 'product_data_explorer',
  entities: [Product, Categories, Navigation],
  migrations: ['src/migration/*.ts'],
  synchronize: true,
  logging: true, // leave empty if you don't have migrations yet
  subscribers: [],
});
