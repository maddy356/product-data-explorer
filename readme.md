# Product Data Explorer

A full-stack solo project for Penetration Testing Lifecycle Management coursework.  
Built with:
- **Frontend:** Next.js (React, Tailwind, React Query)
- **Backend:** NestJS (TypeORM, PostgreSQL)
- **Database:** PostgreSQL
- **Scrapers:** Crawlee + Playwright (for categories & products)

---

## 🚀 Features
- Scrapes categories and products from [World of Books](https://www.worldofbooks.com)
- Stores results in PostgreSQL
- Browse categories and products in a clean UI
- Trigger scrapers from frontend buttons
- Fully REST API based architecture

---

## 📂 Project Structure
product-data-explorer/
├── backend/ # NestJS API + TypeORM + Scrapers
├── frontend/ # Next.js frontend (deployed on Vercel)
└── README.md


---

## 🛠️ Setup (Local Development)

 1. Clone repository
```sh
git clone https://github.com/<your-username>/product-data-explorer.git
cd product-data-explorer
2. Start PostgreSQL (local)
psql -U postgres -d product_data_explorer -h localhost -p 5432

3. Backend
cd backend
npm install
npm run start:dev


Runs on → http://localhost:3001

4. Frontend
cd frontend
npm install
npm run dev


Runs on → http://localhost:3000