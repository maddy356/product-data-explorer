// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(categories);
}
