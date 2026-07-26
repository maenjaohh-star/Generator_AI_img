import { api } from "@/lib/api";

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
    search = ""
) {

    const res = await api.get<GalleryResponse>(
        "/assets",
        {
            params: {
                page,
                limit,
                search
            }
        }
    );

    return res.data;

}