"use client";

interface Props {
    title?: string;
    keywords?: string[] | string;
    category?: string;
}

export default function MetadataPreview({
    title,
    keywords,
    category,
}: Props) {

    const keywordList = Array.isArray(keywords)
        ? keywords
        : typeof keywords === "string"
        ? keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
        : [];

    return (

        <div className="rounded-xl border p-4">

            <h2 className="font-semibold mb-3">
                Metadata
            </h2>

            <p>
                <strong>Title</strong>
            </p>

            <p className="mb-4">
                {title ?? "-"}
            </p>

            <p>
                <strong>Category</strong>
            </p>

            <p className="mb-4">
                {category ?? "-"}
            </p>

            <p>
                <strong>Keywords</strong>
            </p>

            <div className="flex flex-wrap gap-2 mt-2">

                {keywordList.map((keyword) => (

                    <span
                        key={keyword}
                        className="rounded bg-gray-100 px-2 py-1 text-xs"
                    >
                        {keyword}
                    </span>

                ))}

            </div>

        </div>

    );

}