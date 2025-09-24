"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { Product } from "../../../hooks/useProducts";
import { fetcher } from "../../../lib/api";

export default function ProductPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetcher<Product>(`/products/${id}`),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-6">Loading product...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading product</p>;
  if (!data) return <p className="p-6">Product not found</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

      {data.image_url && (
        <img
          src={data.image_url}
          alt={data.title}
          className="w-full h-96 object-cover rounded mb-4"
        />
      )}

      <p className="text-xl font-semibold mb-2">
        {data.price} {data.currency || ""}
      </p>

      {data.source_url && (
        <a
          href={data.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Original
        </a>
      )}
    </main>
  );
}
