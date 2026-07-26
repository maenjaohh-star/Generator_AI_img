import { api } from "@/lib/api";

export async function downloadAsset(id: string) {

    const response = await api.get(

        `/assets/${id}/download`,

        {

            responseType: "blob"

        }

    );

    const url = window.URL.createObjectURL(

        response.data

    );

    const a = document.createElement("a");

    a.href = url;

    a.download = "asset.png";

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

}