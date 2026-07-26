import { api } from "@/lib/api";

export interface JobResponse {

    success: boolean;

    data: {

        id: string;

        status: string;

        progress: number;

    };

}

export async function getJob(

    id: string

): Promise<JobResponse> {

    const response = await api.get<JobResponse>(

        `/jobs/${id}`

    );

    return response.data;

}