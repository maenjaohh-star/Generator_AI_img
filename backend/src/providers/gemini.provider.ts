import { GoogleGenAI, Modality } from "@google/genai";

import {
    ImageProvider,
    GenerateImageRequest,
    GeneratedImage
} from "./provider.types";

export class GeminiProvider implements ImageProvider {

    name = "Gemini";

    private client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!
    });

    async generate(
        request: GenerateImageRequest
    ): Promise<GeneratedImage> {

        const response =
            await this.client.models.generateContent({

                model: "gemini-3.1-flash-image",

                contents: request.prompt,

                config: {
                    responseModalities: [
                        Modality.TEXT,
                        Modality.IMAGE
                    ]
                }

            });

        const parts =
            response.candidates?.[0]
                ?.content?.parts ?? [];

        const imagePart = parts.find(
            p => p.inlineData
        );

        if (!imagePart?.inlineData?.data) {

            throw new Error(
                "Gemini tidak mengembalikan gambar."
            );

        }

        return {

            provider: this.name,

            imageBase64:
                imagePart.inlineData.data,

            revisedPrompt:
                request.prompt

        };

    }

}