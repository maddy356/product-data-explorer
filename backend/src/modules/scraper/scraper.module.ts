import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller.js';
import { ScraperService } from './scraper.service.js';

@Module({
  providers: [ScraperService],
  controllers: [ScraperController],
})
export class ScraperModule {}
