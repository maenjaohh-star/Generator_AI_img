import { api } from "@/lib/api";

export interface AssetResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    prompt: string;
    provider: string;
    model: string;
    imageUrl: string | null;
    status: string;
    title: string | null;
    keywords: string | null;
    category: string | null;
    favorite: boolean;
    createdAt: string;
    updatedAt: string;
    optimizedPrompt?: string | null;
    finalPrompt?: string | null;
  };
}

export interface DownloadOptions {
  upscale?: boolean;
  scale?: number; // 2, 3, 4
  format?: "png" | "jpeg" | "webp";
}

// ============================================================
// GET ASSET BY ID
// ============================================================
export async function getAsset(
  id: string
): Promise<AssetResponse> {
  const response = await api.get<AssetResponse>(
    `/assets/${id}`
  );
  return response.data;
}

// ============================================================
// DELETE ASSET
// ============================================================
export async function deleteAsset(id: string) {
  await api.delete(`/assets/${id}`);
}

// ============================================================
// DELETE MANY ASSETS
// ============================================================
export async function deleteManyAssets(ids: string[]) {
  const response = await api.post("/assets/delete-many", { ids });
  return response.data;
}

// ============================================================
// DOWNLOAD SINGLE ASSET (WITH UPSCALE SUPPORT)
// ============================================================
export async function downloadAsset(
  id: string,
  options: DownloadOptions = {}
) {
  const {
    upscale = true,
    scale = 2,
    format = "png",
  } = options;

  const response = await api.get(
    `/assets/${id}/download`,
    {
      params: {
        upscale: upscale ? "true" : "false",
        scale: scale.toString(),
        format,
      },
      responseType: "blob",
    }
  );

  // Bikin filename dari header atau default
  const contentDisposition = response.headers["content-disposition"];
  let fileName = "image.png";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+?)"?$/);
    if (match) {
      fileName = match[1];
    }
  } else {
    const ext = format === "jpeg" ? "jpg" : format;
    const prefix = upscale ? `upscaled-${scale}x-` : "";
    fileName = `${prefix}asset.${ext}`;
  }

  // Trigger download
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);

  return { success: true, fileName };
}

// ============================================================
// DOWNLOAD ZIP (WITH UPSCALE SUPPORT)
// ============================================================
export async function downloadZip(
  ids: string[],
  options: DownloadOptions = {}
) {
  const {
    upscale = true,
    scale = 2,
    format = "png",
  } = options;

  const response = await api.get(
    "/assets/download-zip",
    {
      params: {
        ids: ids.join(","),
        upscale: upscale ? "true" : "false",
        scale: scale.toString(),
        format,
      },
      responseType: "blob",
    }
  );

  // Bikin filename
  const prefix = upscale ? `upscaled-${scale}x-` : "";
  const fileName = `${prefix}assets-${Date.now()}.zip`;

  // Trigger download
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);

  return { success: true, fileName, count: ids.length };
}

// ============================================================
// GET DOWNLOAD URL (BUAT PREVIEW ATAU MANUAL DOWNLOAD)
// ============================================================
export function getDownloadUrl(
  id: string,
  options: DownloadOptions = {}
): string {
  const {
    upscale = false,
    scale = 2,
    format = "png",
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const params = new URLSearchParams();

  if (upscale) {
    params.set("upscale", "true");
    params.set("scale", scale.toString());
    params.set("format", format);
  }

  const queryString = params.toString();
  return `${baseUrl}/assets/${id}/download${queryString ? `?${queryString}` : ""}`;
}

// ============================================================
// TOGGLE FAVORITE
// ============================================================
export async function toggleFavorite(id: string) {
  const response = await api.patch(`/assets/${id}/favorite`);
  return response.data;
}

// ============================================================
// GET ASSETS (GALLERY)
// ============================================================
export interface GalleryAsset {
  id: string;
  prompt: string;
  title: string | null;
  category: string | null;
  keywords: string | null;
  provider: string;
  model: string | null;
  imageUrl: string | null;
  status: string;
  favorite: boolean;
  createdAt: string;
}

export interface GalleryResponse {
  success: boolean;
  data: GalleryAsset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getGallery(
  page = 1,
  limit = 20,
  search = "",
  provider?: string,
  status?: string,
  sort = "newest"
): Promise<GalleryResponse> {
  const res = await api.get<GalleryResponse>("/assets", {
    params: {
      page,
      limit,
      search,
      provider,
      status,
      sort,
    },
  });
  return res.data;
}