import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBackendBaseUrl() {
  if (process.env.BACKEND_BASE_URL) return process.env.BACKEND_BASE_URL;
  if (process.env.NODE_ENV === 'production') {
    return `http://127.0.0.1:${process.env.PORT || 3000}/backend/api`;
  }
  return 'http://127.0.0.1:5050/api';
}

export function getUploadedImageProxyUrl(imageUrl?: string, type: "categories" | "products" | "orders" = "categories") {
  if (!imageUrl) {
    return "";
  }

  let normalizedUrl = imageUrl.trim().replace(/\/+$/, "");

  if (!normalizedUrl) {
    return "";
  }

  if (normalizedUrl.startsWith("https:/") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = normalizedUrl.replace("https:/", "https://");
  } else if (normalizedUrl.startsWith("http:/") && !normalizedUrl.startsWith("http://")) {
    normalizedUrl = normalizedUrl.replace("http:/", "http://");
  }

  // Support full URLs (e.g. Cloudinary)
  if (normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://") || normalizedUrl.startsWith("//")) {
    return normalizedUrl;
  }

  const withLeadingSlash = normalizedUrl.startsWith("/") ? normalizedUrl : `/${normalizedUrl}`;

  if (withLeadingSlash.startsWith("/api/uploads/")) {
    return withLeadingSlash;
  }

  if (withLeadingSlash.startsWith("/uploads/")) {
    const filename = withLeadingSlash.split("/").pop();
    return filename ? `/api/uploads/${type}/${filename}` : withLeadingSlash;
  }

  return withLeadingSlash;
}

export function getOptimizedCloudinaryUrl(url: string | undefined, width?: number, type: "categories" | "products" | "orders" = "categories") {
  if (!url) return "";
  
  let cleanUrl = url.trim();
  
  if (cleanUrl.startsWith("https:/") && !cleanUrl.startsWith("https://")) {
    cleanUrl = cleanUrl.replace("https:/", "https://");
  } else if (cleanUrl.startsWith("http:/") && !cleanUrl.startsWith("http://")) {
    cleanUrl = cleanUrl.replace("http:/", "http://");
  }

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") || cleanUrl.startsWith("//")) {
    if (cleanUrl.includes("res.cloudinary.com") && width) {
      const parts = cleanUrl.split("/upload/");
      if (parts.length === 2) {
        // Check if it already has transformations (like v123...)
        return `${parts[0]}/upload/w_${width},q_auto,f_auto/${parts[1]}`;
      }
    }
    return cleanUrl;
  }
  
  return getUploadedImageProxyUrl(cleanUrl, type);
}
