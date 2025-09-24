# Product Data Explorer

A full-stack web app that scrapes categories & products from **World of Books** using Crawlee + Playwright, stores them in **PostgreSQL**, and displays them with a **Next.js frontend**.

---

## 🚀 Features
- Scrapes categories & products directly from the site.
- Stores data in PostgreSQL with proper relationships.
- API built with **NestJS** backend.
- Next.js 15 frontend with category & product browsing.
- One-click product/category scraping from the UI.
- Ready to deploy on **Vercel** + **Render/Heroku** (for backend + DB).

---

## 🛠️ Setup

### 1. Clone the repo
```bash
git clone https://github.com/maddy356/product-data-explorer.git
cd product-data-explorer
<<<<<<< HEAD
=======
2. Backend (NestJS API)
bash
Copy code
cd backend
npm install
npm run start:dev
3. Database (Postgres)
Make sure PostgreSQL is running locally:

bash
Copy code
psql -U postgres -d product_data_explorer -h localhost -p 5432
Apply migrations:

bash
Copy code
npm run migration:run
4. Frontend (Next.js 15)
bash
Copy code
cd ../frontend
npm install
npm run dev
👉 Runs at: http://localhost:3000

🔍 Running Scrapers
From backend/:

Scrape categories:

bash
Copy code
npm run scrape:categories
Scrape products:

bash
Copy code
npm run scrape:products
>>>>>>> 11cee2d0edcd484da38e6037f6a94b79f4643859
