"use client";

import { useQuery } from "@tanstack/react-query";
import { getGallery } from "@/services/gallery.service";

export function useGallery(
    page = 1,
    search = ""
) {
    console.log("useGallery dipanggil");

    return useQuery({
        queryKey: ["gallery", page, search],
        queryFn: () =>
            getGallery(
                page,
                20,
                search
            ),
        // Jangan pake localStorage di sini!
        // API interceptor udah handle token
    });
}