import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './modules/categories/categories.service.js';

@Controller('categories')
export class CategoryController {
  // ✅ Singular + PascalCase
  constructor(private readonly categoryService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.categoryService.create(body.name, body.description);
  }
}
