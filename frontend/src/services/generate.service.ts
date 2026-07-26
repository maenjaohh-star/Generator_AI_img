import { api } from "@/lib/api";

export interface GenerateJob {

    jobId: string;

    assetId: string;

    status: string;

}

export interface GenerateResponse {

    success: boolean;

    total: number;

    jobs: GenerateJob[];

}

export interface GenerateRequest {

    subject: string;

    template: string;

    model: string;

    providerModel?: string;

    variation: boolean;

    variationCount: number;

    count: number;

}

export async function generateAsset(

    data: GenerateRequest

): Promise<GenerateResponse> {

    const response = await api.post<GenerateResponse>(

        "/generate",

        data

    );

    return response.data;

}