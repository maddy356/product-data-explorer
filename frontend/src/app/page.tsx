"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";

type Category = {
  id: string | number;
  name: string;
};

export default function HomePage() {
  const { data: categories, isLoading, error } = useCategories();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const triggerScraper = async (type: "categories" | "products") => {
    setLoading(type);
    setMessage("");
    try {
      await axios.post(`http://localhost:3001/scraper/${type}`);
      setMessage(`${type} scraper triggered successfully!`);
    } catch (e) {
      console.error(e);
      setMessage(`Error running ${type} scraper`);
    } finally {
      setLoading(null);
    }
  };

  const categoryList: Category[] = Array.isArray(categories)
    ? (categories as Category[])
    : [];

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📚 Browse Categories</h1>

      <div className="mb-6 space-x-4">
        <button
          onClick={() => triggerScraper("categories")}
          disabled={loading === "categories"}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading === "categories" ? "Scraping Categories..." : "Scrape Categories"}
        </button>
        <button
          onClick={() => triggerScraper("products")}
          disabled={loading === "products"}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading === "products" ? "Scraping Products..." : "Scrape Products"}
        </button>
      </div>

      {message && <p className="mb-6 text-gray-700">{message}</p>}

      {isLoading && <p className="text-gray-500">Loading categories...</p>}
      {error && <p className="text-red-500">Error loading categories</p>}

      {categoryList.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categoryList.map((category) => (
            <li
              key={category.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
            >
              <Link
                href={`/categories/${category.id}`}
                className="block text-lg font-semibold text-blue-600 hover:underline"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No categories available</p>
      )}
    </main>
  );
}