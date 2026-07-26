import prisma from "../config/prisma";

export async function getExportAssets(
    assetIds: string[],
    userId: string
) {

    console.log("========== EXPORT DEBUG ==========");
    console.log("assetIds:", assetIds);
    console.log("userId:", userId);

    const assets = await prisma.asset.findMany({
        where: {
            id: {
                in: assetIds
            },
            userId,
            status: "completed"
        }
    });

    console.log("RESULT:", assets);
    console.log("=================================");

    return assets;

}