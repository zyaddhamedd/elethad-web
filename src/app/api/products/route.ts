import { NextResponse } from "next/server";

const BACKEND_BASE_URL = "http://127.0.0.1:5050/api";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/products`, {
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