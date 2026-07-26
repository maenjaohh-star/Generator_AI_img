import {
    GenerateImageRequest,
    GeneratedImage
} from "./provider.types";

import { ProviderFactory } from "./provider.factory";

export class ProviderService {

    static async generate(
        request: GenerateImageRequest
    ): Promise<GeneratedImage> {

        const providers =
            ProviderFactory.getProviders();

        let lastError: unknown = null;

        for (const provider of providers) {

            try {

                console.log(
                    `[Provider] Trying ${provider.name}...`
                );

                const result =
                    await provider.generate(request);

                console.log(
                    `[Provider] Success: ${provider.name}`
                );

                return result;

            } catch (error) {

                console.log(
                    `[Provider] Failed: ${provider.name}`
                );

                lastError = error;

            }

        }

        throw new Error(
            "Kuota habis, silakan coba lagi nanti."
        );

    }

}