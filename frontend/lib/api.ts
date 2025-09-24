import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 15000,
});

// ✅ always unwrap `.data`
export async function fetcher<T>(url: string): Promise<T> {
  const res = await api.get<T>(url);
  return res.data;
}

export default api;
