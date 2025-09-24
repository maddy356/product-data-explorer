import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../categories/category.entity.js';
import { CategoriesController } from './categories.controller.js'; // ✅ matches class name
import { CategoriesService } from './categories.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Categories])],
  providers: [CategoriesService],
  controllers: [CategoriesController], // ✅ matches class name
})
export class CategoryModule {}
