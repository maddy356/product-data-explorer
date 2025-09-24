import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../lib/api";

export interface Product {
  id: number;
  title: string;
  price: number;
  currency?: string;
  image_url?: string;
  source_url?: string;
}

export function useProducts(categoryId?: number) {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () =>
      categoryId
        ? fetcher<Product[]>(`/categories/${categoryId}/products`)
        : fetcher<Product[]>("/products"),
    enabled: categoryId !== undefined,
  });
}
