"use client";

import { useQuery } from "@tanstack/react-query";
import { getAsset } from "@/services/asset.service";

export function useAsset(
    assetId?: string,
    enabled = true
) {
    return useQuery({
        queryKey: ["asset", assetId],
        queryFn: () => getAsset(assetId!),
        enabled: enabled && !!assetId,
        refetchInterval: enabled ? 2000 : false,
        refetchOnWindowFocus: false,
        staleTime: 0,
    });
}