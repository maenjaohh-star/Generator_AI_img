import { createAsset } from "./asset.service";
import { GenerateService } from "./generate.service";

interface BatchRequest {

    userId: string;

    subject: string;

    style: any;

    variation: boolean;

    variationCount: number;

}

export async function batchGenerate(
    request: BatchRequest
) {

    const results = [];

    for (

        let i = 1;

        i <= request.variationCount;

        i++

    ) {

        const asset = await createAsset(

            request.userId,

            `${request.subject} ${i}`,

            "pending",

            "pending"

        );

        const generated = await GenerateService.generate({

            assetId: asset.id,

            userId: request.userId,

            subject: `${request.subject} ${i}`,

            style: request.style,

            variation: false,

            variationCount: 1

        });

        results.push(generated);

    }

    return results;

}