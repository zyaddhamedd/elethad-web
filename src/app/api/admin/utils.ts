import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function fetchAdminBackend(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return response;
}
