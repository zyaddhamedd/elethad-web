import { getBackendBaseUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { fetchAdminBackend } from "@/app/api/admin/utils";

const BACKEND_BASE_URL = getBackendBaseUrl();

export async function GET() {
  try {
    const response = await fetchAdminBackend(`${BACKEND_BASE_URL}/categories`, {
      cache: "no-store",
    });
    if (response instanceof NextResponse) return response;

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetchAdminBackend(`${BACKEND_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response instanceof NextResponse) return response;

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
