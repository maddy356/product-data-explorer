import { Injectable } from '@nestjs/common';
// adjust paths if scrapers are outside /src
import { runProductScraper } from './../../scrapers/productScraper.mjs';
import { runScrapeCategories } from './../../scrapers/scrapeCategories.mjs';

@Injectable()
export class ScraperService {
  async scrapeCategories() {
    await runScrapeCategories();
    return { message: 'Categories scraped and stored ✅' };
  }

  async scrapeProducts() {
    await runProductScraper();
    return { message: 'Products scraped and stored ✅' };
  }
}
