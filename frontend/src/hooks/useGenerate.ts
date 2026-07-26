"use client";

import { useMutation } from "@tanstack/react-query";

import { generateAsset } from "@/services/generate.service";

export function useGenerate() {

    return useMutation({

        mutationFn: generateAsset

    });

}