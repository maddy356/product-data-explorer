import { log, PlaywrightCrawler } from 'crawlee';
import { Pool, QueryResult } from 'pg';

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'product_data_explorer',
  password: 'madhur',
  port: 5432,
});

const BASE = 'https://www.worldofbooks.com';

function toAbs(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return `${BASE}${href.startsWith('/') ? '' : '/'}${href}`;
}

/**
 * Conflict-proof save:
 *  1) Try INSERT(name, link) ON CONFLICT DO NOTHING  -> never throws even with UNIQUE(name) or UNIQUE(link)
 *  2) If link row not present, try to attach link to an existing row by name (updates only link, not name)
 *  3) Never UPDATE name -> avoids violating UNIQUE(name)
 */
async function saveCategoryNoNameUpdate(name: string, link: string): Promise<void> {
  // 1) insert best-effort
  await pool.query(
    `INSERT INTO public.categories (name, link, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW())
     ON CONFLICT DO NOTHING`,
    [name, link],
  );

  // 2) if a row with this link already exists, done
  const byLink: QueryResult = await pool.query(
    `SELECT id FROM public.categories WHERE link = $1 LIMIT 1`,
    [link],
  );
  if ((byLink.rowCount ?? 0) > 0) return;

  // 3) attach link to existing name (if present) without modifying name
  await pool.query(
    `UPDATE public.categories
       SET link = $2, updated_at = NOW()
     WHERE name = $1`,
    [name, link],
  );
}

export async function runScrapeCategories(): Promise<void> {
  const crawler = new PlaywrightCrawler({
    async requestHandler({ page, request }) {
      log.info(`Scraping categories from: ${request.url}`);

      const raw = await page.$$eval(
        'a[data-menu_category], nav a[href*="/collections/"], nav a[href*="/pages/"]',
        (els) =>
          (els as Element[])
            .filter((el) => el instanceof HTMLAnchorElement)
            .map((el) => {
              const a = el as HTMLAnchorElement;
              const name =
                a.getAttribute('data-menu_category')?.trim() ||
                a.textContent?.trim() ||
                '';
              const link = a.getAttribute('href') || a.href || '';
              return { name, link };
            })
            .filter((c) => !!c.name && !!c.link),
      );

      // Normalize & dedupe
      const seen = new Set<string>();
      const categories = raw
        .map((c) => ({ name: c.name, link: toAbs(c.link) }))
        .filter((c) => {
          if (c.link.endsWith('/books')) return false; // skip landing page
          if (seen.has(c.link)) return false;
          seen.add(c.link);
          return true;
        });

      for (const cat of categories) {
        await saveCategoryNoNameUpdate(cat.name, cat.link);
        log.info(`Saved category: ${cat.name} -> ${cat.link}`);
      }
    },
  });

  await crawler.run(['https://www.worldofbooks.com/books']);
  log.info('Categories scraping finished!');
  await pool.end();
}