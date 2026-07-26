import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import path from "path";
import { StorageService } from "../storage/storage.service";

export async function createAsset(
    userId: string,
    prompt: string,
    provider: string,
    model?: string
) {
    return prisma.asset.create({
        data: {
            userId,
            prompt,
            provider,
            model,
            status: "pending"
        }
    });
}

export async function getUserAssets(
    userId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    provider?: string,
    status?: string,
    sort: string = "newest"
) {

    const where: any = { userId };

    if (search) {
        where.OR = [
            {
                prompt: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        ];
    }

    if (provider) where.provider = provider;
    if (status) where.status = status;

    const total = await prisma.asset.count({
        where
    });

    const assets = await prisma.asset.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: sort === "oldest" ? "asc" : "desc"
        }
    });

    return {
        data: assets,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function getAssetById(
    assetId: string,
    userId: string
) {

    const asset = await prisma.asset.findFirst({
        where: {
            id: assetId,
            userId
        }
    });

    if (!asset) {
        throw new HttpError(
            404,
            "Asset tidak ditemukan"
        );
    }

    return asset;
}

export async function updateAsset(
    assetId: string,
    userId: string,
    data: {
        imageUrl?: string;
        status?: string;
        title?: string;
        keywords?: string;
        category?: string;
    }
) {

    await getAssetById(assetId, userId);

    return prisma.asset.update({
        where: {
            id: assetId
        },
        data
    });
}

export async function deleteAsset(
    assetId: string,
    userId: string
) {

    const asset = await getAssetById(

        assetId,

        userId

    );

    if (asset.imageUrl) {

        StorageService.deleteFile(

            asset.imageUrl

        );

    }

    return prisma.asset.delete({

        where: {

            id: assetId

        }

    });

}
export async function toggleFavorite(
    assetId: string,
    userId: string
) {

    const asset = await getAssetById(assetId, userId);

    return prisma.asset.update({
        where: {
            id: asset.id
        },
        data: {
            favorite: !asset.favorite
        }
    });
}

export async function getAssetDownload(
    assetId: string,
    userId: string
) {

    const asset = await getAssetById(assetId, userId);

    if (!asset.imageUrl) {
        throw new HttpError(
            404,
            "Asset belum mempunyai gambar"
        );
    }

    if (!StorageService.exists(asset.imageUrl)) {
        throw new HttpError(
            404,
            "File tidak ditemukan"
        );
    }

    const filename = asset.imageUrl.replace(
        "/uploads/",
        ""
    );

    return {
        asset,
        filename,
        filepath: path.join(
            process.cwd(),
            "uploads",
            filename
        )
    };
}

export async function updateGeneratedAsset(
    assetId: string,
    data: {

        provider: string;

        model: string;

        imageUrl: string;

        status: string;

        title?: string;

        keywords?: string;

        category?: string;

        optimizedPrompt?: string;

        finalPrompt?: string;

    }

) {

    return prisma.asset.update({
        where: {
            id: assetId
        },
        data
    });

}

export async function getAssetsForZip(

    userId: string,

    ids?: string[]

) {

    return prisma.asset.findMany({

        where: {

            userId,

            status: "completed",

            imageUrl: {

                not: null

            },

            ...(ids && ids.length > 0
                ? {
                    id: {
                        in: ids
                    }
                }
                : {})

        },

        orderBy: {

            createdAt: "desc"

        }

    });

}

export async function deleteManyAssets(
    ids: string[],
    userId: string
) {

    const assets = await prisma.asset.findMany({

        where: {

            id: {

                in: ids

            },

            userId

        }

    });

    for (const asset of assets) {

        if (asset.imageUrl) {

            StorageService.deleteFile(

                asset.imageUrl

            );

        }

    }

    return prisma.asset.deleteMany({

        where: {

            id: {

                in: ids

            },

            userId

        }

    });

}
