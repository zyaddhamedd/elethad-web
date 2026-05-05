import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = "http://127.0.0.1:5050/api";

type RouteContext = {
  params: Promise<{ identifier: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { identifier } = await context.params;
    const response = await fetch(`${BACKEND_BASE_URL}/products/${identifier}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}