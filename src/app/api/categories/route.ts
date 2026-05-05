import { NextResponse } from "next/server";

const BACKEND_BASE_URL = "http://127.0.0.1:5050/api";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[API] Categories fetch failed: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
