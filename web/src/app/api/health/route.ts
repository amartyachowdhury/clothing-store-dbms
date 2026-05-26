import { NextResponse } from "next/server";
import { apiJson } from "@/lib/api";

export async function GET() {
  try {
    const result = await apiJson<{ status: string; database: string }>("/health");
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { status: "error", database: "disconnected" },
      { status: 503 },
    );
  }
}
