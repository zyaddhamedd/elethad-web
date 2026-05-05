import { getBackendBaseUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = getBackendBaseUrl().replace("/api", "");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const response = await fetch(`${BACKEND_BASE_URL}/uploads/orders/${filename}`);

    if (!response.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
