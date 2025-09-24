"use client";

import axios from "axios";
import { useState } from "react";

export default function ScraperButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const triggerScraper = async (type: "categories" | "products") => {
    setLoading(type);
    setMessage("");
    try {
      const res = await axios.post(`http://localhost:3001/scraper/${type}`);
      setMessage(`${type} scraping started successfully!`);
    } catch (err) {
      setMessage(`Error triggering ${type} scraper`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-x-4 my-6">
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

      {message && <p className="mt-3 text-gray-700">{message}</p>}
    </div>
  );
}
