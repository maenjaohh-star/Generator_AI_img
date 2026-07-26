"use client";

import { useMutation } from "@tanstack/react-query";
import { downloadZip, DownloadOptions } from "@/services/asset.service";

export function useDownloadZip() {
  return useMutation({
    mutationFn: ({
      ids,
      options,
    }: {
      ids: string[];
      options?: DownloadOptions;
    }) => downloadZip(ids, options),
  });
}