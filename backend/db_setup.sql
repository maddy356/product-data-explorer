-- 1) CATEGORIES: remove unique on name (it causes conflicts), enforce unique on link
--    Adjust the constraint name below only if it differs in your DB.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'UQ_8b0be371d28245da6e4f4b61878'
      AND conrelid = 'categories'::regclass
  ) THEN
    ALTER TABLE categories
      DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878";
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'categories_link_key'
      AND conrelid = 'categories'::regclass
  ) THEN
    ALTER TABLE categories
      ADD CONSTRAINT categories_link_key UNIQUE (link);
  END IF;
END $$;

-- 2) PRODUCTS: ensure unique on source_url exists (for upsert target)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_source_url_key'
      AND conrelid = 'products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_source_url_key UNIQUE (source_url);
  END IF;
END $$;

-- 3) PRODUCTS: optional but recommended:
-- if the site sometimes omits/duplicates source_id, this unique causes failures.
-- We will generate a fallback from source_url in code, but if you still see
-- duplicate-key errors on source_id, uncomment the DROP below.

-- ALTER TABLE products DROP CONSTRAINT "UQ_3b9c1a9a999272cdaa9e3d19527";

-- 4) PRODUCTS: ensure FK exists (yours already does, this is idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_category_fk'
      AND conrelid = 'products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_category_fk
      FOREIGN KEY ("categoryId") REFERENCES categories(id)
      ON DELETE SET NULL;
  END IF;
END $$;
