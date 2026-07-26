export function buildAdobeCSV(
    assets: any[]
) {

    const header = [

        "Filename",

        "Title",

        "Keywords",

        "Category"

    ];

    const rows = assets.map(asset => [

        asset.imageUrl.split("/").pop(),

        asset.title ?? "",

        asset.keywords ?? "",

        asset.category ?? ""

    ]);

    return [

        header.join(","),

        ...rows.map(r =>

            r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")

        )

    ].join("\n");

}