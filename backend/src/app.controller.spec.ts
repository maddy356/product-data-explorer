import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './app.controller.js'; // ← note the change
import { CategoriesService } from './modules/categories/categories.service.js';

describe('CategoryController', () => {
  let categoryController: CategoryController;

  const mockCategoriesService = {
    findAll: jest.fn().mockReturnValue([]),
    create: jest
      .fn()
      .mockImplementation((name: string, description?: string) => ({
        name,
        description,
      })),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile();

    categoryController = app.get<CategoryController>(CategoryController);
  });

  describe('findAll', () => {
    it('should return an array', () => {
      expect(categoryController.findAll()).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a category', () => {
      const result = categoryController.create({
        name: 'Fiction',
        description: 'Books',
      });
      expect(result).toEqual({ name: 'Fiction', description: 'Books' });
    });
  });
});
