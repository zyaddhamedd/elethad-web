import { getBackendBaseUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = getBackendBaseUrl();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Login failed" }, { status: response.status });
    }

    // Set cookie
    const res = NextResponse.json(data, { status: 200 });
    res.cookies.set("admin_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
