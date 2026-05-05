import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = "http://127.0.0.1:5050/api";

// Public: submit new order (multipart/form-data with optional screenshot)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await fetch(`${BACKEND_BASE_URL}/orders`, {
      method: "POST",
      body: formData, // forward as-is (multer handles it on the backend)
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
