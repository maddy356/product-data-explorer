import { NextRequest, NextResponse } from "next/server";

// Sample product data
const products = [
  { id: 1, name: "Product A" },
  { id: 2, name: "Product B" },
  { id: 3, name: "Product C" },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(products);
}
