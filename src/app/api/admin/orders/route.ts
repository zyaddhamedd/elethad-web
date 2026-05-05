import { getBackendBaseUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { fetchAdminBackend } from "@/app/api/admin/utils";

const BACKEND_BASE_URL = getBackendBaseUrl();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = new URLSearchParams();
    if (searchParams.get("payment_method")) params.set("payment_method", searchParams.get("payment_method")!);
    if (searchParams.get("status")) params.set("status", searchParams.get("status")!);

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await fetchAdminBackend(`${BACKEND_BASE_URL}/orders${qs}`, { cache: "no-store" });
    if (response instanceof NextResponse) return response;
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
