import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from './category.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoryRepo: Repository<Categories>,
  ) {}

  // Get all categories with relations
  findAll() {
    return this.categoryRepo.find({ relations: ['products'] });
  }

  // Get a single category by ID
  findOne(id: number) {
    return this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  // Create a new category
  create(name: string, description?: string) {
    const category = this.categoryRepo.create({ name, description });
    return this.categoryRepo.save(category);
  }
}
