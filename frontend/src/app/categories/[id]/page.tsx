"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  source_url: string;
}

interface CategoryResponse {
  id: number;
  name: string;
  products: Product[];
}

export default function CategoryProductsPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["category-products", id],
    queryFn: async () => {
      const res = await axios.get<CategoryResponse>(
        `${API}/categories/${id}`
      );
      return res.data.products || [];
    },
  });

  if (isLoading) return <p className="p-6">Loading products...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading products</p>;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Products in Category {id}</h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {data.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold">{product.title}</h3>
              <p className="text-gray-700">
                {product.price} {product.currency}
              </p>
              <a
                href={product.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View Product
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found in this category</p>
      )}
    </main>
  );
}
