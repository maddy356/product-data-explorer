import { NextRequest, NextResponse } from "next/server";

// Sample navigation items
const navigation = [
  { id: 1, title: "Home", link: "/" },
  { id: 2, title: "Categories", link: "/categories" },
  { id: 3, title: "Products", link: "/products" },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(navigation);
}
