export interface StorefrontCategory {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StorefrontProductSpec {
  label: string;
  value: string;
}

export interface StorefrontProduct {
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
  specs?: StorefrontProductSpec[];
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

function toProductsImageUrl(imageUrl?: string) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("/api/uploads/")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads/")) {
    const filename = imageUrl.split("/").pop();
    return filename ? `/api/uploads/products/${filename}` : imageUrl;
  }

  return imageUrl;
}

export async function fetchStorefrontCategories(): Promise<StorefrontCategory[]> {
  try {
    const response = await fetch("/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch categories: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Handle both direct array or wrapped response
    const categories = Array.isArray(data) ? data : data.categories || [];

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image_url: cat.image_url,
      description: cat.description,
      created_at: cat.created_at,
      updated_at: cat.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching storefront categories:", error);
    return [];
  }
}

export async function fetchStorefrontProducts(): Promise<StorefrontProduct[]> {
  try {
    const response = await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const products = Array.isArray(data) ? data : data.products || [];

    return products.map((product: any) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: toProductsImageUrl(product.image || product.image_url || ""),
      image_url: toProductsImageUrl(product.image_url || product.image),
      category: product.category,
      description: product.description,
      rating: Number(product.rating || 0),
      reviews: Number(product.reviews || 0),
      tags: product.tags || [],
      features: product.features || [],
      specs: product.specs || [],
      images: (product.images || (product.image || product.image_url ? [product.image || product.image_url] : [])).map((image: string) => toProductsImageUrl(image)),
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching storefront products:", error);
    return [];
  }
}

export async function fetchStorefrontProduct(identifier: string): Promise<StorefrontProduct | null> {
  try {
    const response = await fetch(`/api/products/${encodeURIComponent(identifier)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const product = await response.json();
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: toProductsImageUrl(product.image || product.image_url || ""),
      image_url: toProductsImageUrl(product.image_url || product.image),
      category: product.category,
      description: product.description,
      rating: Number(product.rating || 0),
      reviews: Number(product.reviews || 0),
      tags: product.tags || [],
      features: product.features || [],
      specs: product.specs || [],
      images: (product.images || (product.image || product.image_url ? [product.image || product.image_url] : [])).map((image: string) => toProductsImageUrl(image)),
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  } catch (error) {
    console.error("Error fetching storefront product:", error);
    return null;
  }
}
