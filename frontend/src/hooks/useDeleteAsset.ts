"use client";

import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { deleteAsset } from "@/services/delete-asset.service";

export function useDeleteAsset() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: deleteAsset,

        onSuccess() {

            queryClient.invalidateQueries({

                queryKey: ["gallery"]

            });

        }

    });

}