import { useQuery } from "@tanstack/react-query";

export interface NavItem {
  id: number;
  title: string;
  link: string;
}

export const useNavigation = () => {
  return useQuery<NavItem[], Error>({
    queryKey: ["navigation"],
    queryFn: async () => {
      const res = await fetch("/api/navigation");
      if (!res.ok) throw new Error("Failed to fetch navigation");
      return res.json();
    },
  });
};