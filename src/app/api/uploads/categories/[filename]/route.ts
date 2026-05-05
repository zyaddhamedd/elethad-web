import { NextResponse, NextRequest } from "next/server";

const BACKEND_BASE_URL = "http://127.0.0.1:5050";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const response = await fetch(`${BACKEND_BASE_URL}/uploads/categories/${filename}`, {
      method: "GET",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Get content type from backend response
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[API] Image proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
