<<<<<<< HEAD
import { log, PlaywrightCrawler } from 'crawlee';
import { QueryResult } from 'pg'; // ✅ import type from pg
import { pool } from '../pool'; // ✅ import your shared pool instance
=======
import { PlaywrightCrawler, log } from 'crawlee';
import { Pool, QueryResult } from './pool.ts';


>>>>>>> 11cee2d0edcd484da38e6037f6a94b79f4643859
const BASE = 'https://www.worldofbooks.com';

function toAbs(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return `${BASE}${href.startsWith('/') ? '' : '/'}${href}`;
}

function normalizeImage(src: string): string {
  if (!src) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (src.startsWith('http')) return src;
  if (src.startsWith('//')) return `https:${src}`;
  if (src.startsWith('/')) return `${BASE}${src}`;
  return src;
}

function fallbackSourceIdFromUrl(absUrl: string): string {
  try {
    const u = new URL(absUrl);
    return u.pathname.replace(/\/+$/, ''); // stable per product URL
  } catch {
    return absUrl || 'unknown-source-id';
  }
}

function toNumericPrice(input: string): string {
  const cleaned = (input || '').replace(/[^0-9.]/g, '');
  return cleaned === '' ? '0' : cleaned;
}

// Update by source_url; if no row, insert (do nothing on conflict).
async function upsertProduct(
  product: {
    source_id: string;
    title: string;
    price: string; // raw string like "£4.99"
    currency: string;
    image_url: string;
    source_url: string;
  },
  categoryId: number,
): Promise<void> {
  const priceNumeric = toNumericPrice(product.price);

  // ✅ FIXED PARAM ORDER: start placeholders at $1 and match array 1:1
  const upd: QueryResult = await pool.query(
    `UPDATE public.products
        SET title = $1,
            price = $2::numeric,
            currency = $3,
            image_url = $4,
            last_scraped_at = NOW(),
            "categoryId" = $6
      WHERE source_url = $5`,
    [
      product.title,      // $1
      priceNumeric,       // $2
      product.currency,   // $3
      product.image_url,  // $4
      product.source_url, // $5
      categoryId,         // $6
    ],
  );

  if ((upd.rowCount ?? 0) > 0) return;

  await pool.query(
    `INSERT INTO public.products (source_id, title, price, currency, image_url, source_url, last_scraped_at, "categoryId")
     VALUES ($1, $2, $3::numeric, $4, $5, $6, NOW(), $7)
     ON CONFLICT DO NOTHING`,
    [
      product.source_id,  // $1
      product.title,      // $2
      priceNumeric,       // $3
      product.currency,   // $4
      product.image_url,  // $5
      product.source_url, // $6
      categoryId,         // $7
    ],
  );
}

export async function runProductScraper(): Promise<void> {
  log.info('Starting product scraper...');

  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 100,
    requestHandlerTimeoutSecs: 60,
    async requestHandler({ page, request }) {
      await page.waitForLoadState('domcontentloaded');

      const categoryName: string =
        (await page.$eval('h1', (el) => el.textContent?.trim() || '')) || 'Unknown';

      // Get or create category WITHOUT touching name (to avoid UNIQUE(name) collisions)
      let categoryId: number | null = null;

      const byLink: QueryResult = await pool.query(
        `SELECT id FROM public.categories WHERE link = $1 LIMIT 1`,
        [request.url],
      );
      if ((byLink.rowCount ?? 0) > 0) {
        const idRow = byLink.rows[0] as { id: number };
        categoryId = idRow.id;
      } else {
        // Try attach link to same name (if exists)
        const byName: QueryResult = await pool.query(
          `SELECT id FROM public.categories WHERE name = $1 LIMIT 1`,
          [categoryName],
        );
        if ((byName.rowCount ?? 0) > 0) {
          const idRow = byName.rows[0] as { id: number };
          await pool.query(
            `UPDATE public.categories
                SET link = $2, updated_at = NOW()
              WHERE id = $1`,
            [idRow.id, request.url],
          );
          categoryId = idRow.id;
        } else {
          // Insert new; ignore conflicts
          const ins: QueryResult = await pool.query(
            `INSERT INTO public.categories (name, link, created_at, updated_at)
             VALUES ($1, $2, NOW(), NOW())
             ON CONFLICT DO NOTHING
             RETURNING id`,
            [categoryName, request.url],
          );
          if ((ins.rowCount ?? 0) > 0) {
            const idRow = ins.rows[0] as { id: number };
            categoryId = idRow.id;
          } else {
            // Last resort: fetch either by link or name
            const sel: QueryResult = await pool.query(
              `SELECT id FROM public.categories WHERE link = $1 OR name = $2 LIMIT 1`,
              [request.url, categoryName],
            );
            categoryId = (sel.rowCount ?? 0) > 0 ? (sel.rows[0] as { id: number }).id : null;
          }
        }
      }

      log.info(
        `Scraping products for category: ${categoryName} (${categoryId ?? 'unknown'})`,
      );

      try {
        await page.waitForSelector('a[data-item_name], a.product-card, a[href*="/products/"]', {
          timeout: 10000,
        });
      } catch {
        log.info(`⚠ No product anchors visible for ${request.url}`);
      }

      const findings = await page.$$eval(
        'a[data-item_name], a.product-card, a[href*="/products/"]',
        (anchors) =>
          (anchors as Element[])
            .map((aEl) => {
              const getAttr = (el: Element, name: string) => el.getAttribute(name) || '';
              const a = aEl as HTMLAnchorElement;

              const title =
                getAttr(a, 'data-item_name') ||
                (a.querySelector('[data-item_name]') as HTMLElement | null)?.getAttribute('data-item_name') ||
                (a.querySelector('h2, h3, .title') as HTMLElement | null)?.textContent?.trim() ||
                a.getAttribute('title') ||
                (a.textContent || '').trim();

              const rawSourceId =
                getAttr(a, 'data-item_id') ||
                (a.querySelector('[data-item_id]') as HTMLElement | null)?.getAttribute('data-item_id') ||
                '';

              const priceAttr =
                getAttr(a, 'data-price') ||
                (a.querySelector('[data-price]') as HTMLElement | null)?.getAttribute('data-price') ||
                (a.querySelector('.price, [class*="price"]') as HTMLElement | null)?.textContent?.trim() ||
                '';

              const imgEl =
                (a.querySelector('img') ||
                  a.closest('li, .product')?.querySelector('img')) as Element | null;

              const src = (imgEl?.getAttribute('src') || '').trim();
              const dataSrc = (imgEl?.getAttribute('data-src') || '').trim();
              const srcset = (imgEl?.getAttribute('srcset') || '').trim();
              const firstFromSrcset = srcset ? srcset.split(' ')[0] : '';

              const href = getAttr(a, 'href') || '';

              return {
                rawSourceId,
                title,
                price: (priceAttr || '').replace(/\s+/g, ' ').trim(),
                image_url: src || dataSrc || firstFromSrcset || '',
                source_url: href,
              };
            })
            .filter((p) => !!p.title && !!p.source_url),
      );

      if (findings.length === 0) {
        log.info(`⚠ No products found for ${categoryName}`);
        return;
      }

      if (categoryId == null) {
        log.info(`⚠ Skipping products for ${categoryName} — no categoryId could be resolved.`);
        return;
      }

      for (const p of findings) {
        const absUrl = toAbs(p.source_url);
        const img = normalizeImage(p.image_url);
        const sourceId = p.rawSourceId || fallbackSourceIdFromUrl(absUrl);

        try {
          await upsertProduct(
            {
              source_id: sourceId,
              title: p.title,
              price: p.price,
              currency: 'GBP',
              image_url: img,
              source_url: absUrl,
            },
            categoryId,
          );
          log.info(`✅ Saved product: ${p.title}`);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          log.error(
            `Failed saving product "${p.title}" for ${categoryName}: ${msg}`,
          );
        }
      }
    },
  });

  await crawler.run([
    `${BASE}/collections/science-fiction-books`,
    `${BASE}/collections/cookbooks-and-recipe-books`,
    `${BASE}/collections/rare-technology-engineering-agriculture-books`,
  ]);

  log.info('Products scraping finished!');
  await pool.end();
}
