import { api } from "@/lib/api";

export async function deleteAsset(id: string) {

    const response = await api.delete(

        `/assets/${id}`

    );

    return response.data;

}