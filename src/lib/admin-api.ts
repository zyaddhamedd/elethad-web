const ADMIN_API_BASE = "/api/admin";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  image_url?: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  tags: string[];
  features?: string[];
  specs?: ProductSpec[];
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export type ProductPayload = {
  name: string;
  slug: string;
  category: string;
  price: number;
  imageUrl?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  features?: string[];
  specs?: ProductSpec[];
  images?: string[];
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === "string" ? payload : payload?.error || "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export async function fetchCategories() {
  const response = await fetch(`${ADMIN_API_BASE}/categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  return parseResponse<Category[]>(response);
}

export async function createCategory(data: { name: string; slug: string; imageUrl?: string; description?: string }) {
  const response = await fetch(`${ADMIN_API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse<Category>(response);
}

export async function updateCategory(id: number, data: { name: string; slug: string; imageUrl?: string; description?: string }) {
  const response = await fetch(`${ADMIN_API_BASE}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse<Category>(response);
}

export async function uploadCategoryImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${ADMIN_API_BASE}/uploads`, {
    method: "POST",
    body: formData,
  });

  return parseResponse<{ success: boolean; imageUrl: string; filename: string }>(response);
}

export async function deleteCategory(id: number) {
  const response = await fetch(`${ADMIN_API_BASE}/categories/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  return parseResponse<{ message: string }>(response);
}

export async function fetchProducts() {
  const response = await fetch(`${ADMIN_API_BASE}/products`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  return parseResponse<Product[]>(response);
}

export async function createProduct(data: ProductPayload) {
  const response = await fetch(`${ADMIN_API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse<Product>(response);
}

export async function updateProduct(id: number, data: ProductPayload) {
  const response = await fetch(`${ADMIN_API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse<Product>(response);
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${ADMIN_API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  return parseResponse<{ message: string }>(response);
}

export async function uploadProductImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${ADMIN_API_BASE}/uploads?type=products`, {
    method: "POST",
    body: formData,
  });

  return parseResponse<{ success: boolean; imageUrl: string; filename: string }>(response);
}