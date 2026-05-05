import { getBackendBaseUrl } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";
import { fetchAdminBackend } from "@/app/api/admin/utils";

const BACKEND_BASE_URL = getBackendBaseUrl();

export async function POST(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type") || "categories";
    const formData = await request.formData();
    const response = await fetchAdminBackend(`${BACKEND_BASE_URL}/uploads/upload?type=${encodeURIComponent(type)}`, {
      method: "POST",
      body: formData,
    });
    if (response instanceof NextResponse) return response;

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
