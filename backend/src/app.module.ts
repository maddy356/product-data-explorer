import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './modules/categories/category.module.js';
import { NavigationModule } from './modules/navigation/navigation.module.js';
import { ProductModule } from './modules/products/product.module.js';
import { ScraperModule } from './modules/scraper/scraper.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'madhur',
      database: process.env.DB_NAME || 'product_data_explorer',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ dev only
    }),
    NavigationModule,
    CategoryModule,
    ProductModule,
    ScraperModule,
  ],
})
export class AppModule {}
