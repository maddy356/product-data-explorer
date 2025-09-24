"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";

type Product = {
  id: string | number;
  title: string;
  image_url: string;
  price: number | string;
  currency: string;
  source_url: string;
};

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return (await res.json()) as T;
};

export default function CategoryProductsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: products, error } = useSWR<Product[]>(
    id ? `/products?categoryId=${encodeURIComponent(id)}` : null,
    fetcher<Product[]>
  );

  if (error) {
    return <p className="p-6 text-red-500">Error loading products</p>;
  }
  if (!products) {
    return <p className="p-6">Loading products...</p>;
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Products in Category {id}</h1>

      {products.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="border rounded-lg p-4 shadow bg-white hover:shadow-lg transition"
            >
              <div className="relative w-full h-48 mb-2">
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-green-600 font-bold mt-1">
                {product.price} {product.currency}
              </p>
              <a
                href={product.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm mt-2 block"
              >
                View Product
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found in this category</p>
      )}
    </main>
  );
}
