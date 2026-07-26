import { ImageProvider } from "./provider.types";
import { GeminiProvider } from "./gemini.provider";
import { HuggingFaceProvider } from "./huggingface.provider";
import { PollinationsProvider } from "./pollinations.provider";

export class ProviderFactory {
    /**
     * Smart Provider Router dengan Priority:
     * 1. Pollinations - Gratis, generous, kualitas bagus
     * 2. HuggingFace - Gratis tier, multiple models
     * 3. Gemini - 100/hari, cadangan terakhir
     */
    static getProviders(model: string = "auto"): ImageProvider[] {
        switch (model) {
            // Provider spesifik
            case "gemini":
                return [new GeminiProvider()];

            case "huggingface":
            case "huggingface-flux":
                return [new HuggingFaceProvider()];

            case "pollinations":
            case "pollinations-flux":
            case "pollinations-turbo":
                return [new PollinationsProvider()];

            // Smart Auto Router (Prioritas: Gratis → Premium)
            case "auto":
            default:
                return [
                    new PollinationsProvider(),   // 1. Gratis & generous
                    new HuggingFaceProvider(),    // 2. Gratis tier
                    new GeminiProvider(),         // 3. 100/hari cadangan
                ];
        }
    }
}