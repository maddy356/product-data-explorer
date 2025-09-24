import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../lib/api";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetcher<Category[]>("/categories"), // ✅ returns Promise<Category[]>
  });
}
