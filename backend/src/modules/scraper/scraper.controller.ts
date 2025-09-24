import { Controller, Post } from '@nestjs/common';
import { ScraperService } from './scraper.service.js';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('categories')
  async scrapeCategories() {
    return this.scraperService.scrapeCategories();
  }

  @Post('products')
  async scrapeProducts() {
    return this.scraperService.scrapeProducts();
  }
}
