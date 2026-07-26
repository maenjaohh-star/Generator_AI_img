"use client";

interface Props {
    image?: string;
}

export default function PreviewCard({ image }: Props) {

    const url = image
        ? `http://localhost:5000${image}`
        : "";

    console.log("IMAGE URL =", url);

    return (
        <div className="rounded-xl border p-6">

            {image ? (

                <img
                    src={url}
                    alt="Preview"
                    className="w-full rounded-lg border border-red-500"
                    onLoad={() => console.log("IMAGE LOADED")}
                    onError={(e) => {
                        console.log("IMAGE ERROR");
                        console.log(e.currentTarget.src);
                    }}
                />

            ) : (

                <div className="h-80 flex items-center justify-center text-gray-400">
                    Belum ada gambar
                </div>

            )}

        </div>
    );
}