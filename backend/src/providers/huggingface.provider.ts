import { InferenceClient } from "@huggingface/inference";
import {
    ImageProvider,
    GenerateImageRequest,
    GeneratedImage
} from "./provider.types";

// Model mapping
const HF_MODELS = {
    "flux-schnell": "black-forest-labs/FLUX.1-schnell",
    "flux-dev": "black-forest-labs/FLUX.1-dev",
    "sdxl": "stabilityai/stable-diffusion-xl-base-1.0",
    "sd3": "stabilityai/stable-diffusion-3.5-large",
    "playground": "playgroundai/playground-v2.5-1024px-aesthetic",
} as const;

export class HuggingFaceProvider implements ImageProvider {
    name = "HuggingFace";

    private client = new InferenceClient(
        process.env.HF_API_KEY!
    );

    async generate(
        request: GenerateImageRequest
    ): Promise<GeneratedImage> {
        // Pilih model dari request atau default ke flux-schnell
        const modelKey = (request as any).model || "flux-schnell";
        const modelId = HF_MODELS[modelKey as keyof typeof HF_MODELS] || HF_MODELS["flux-schnell"];

        console.log("HuggingFace Model:", modelId);
        console.log("HuggingFace Prompt:", request.prompt);

        const image = await this.client.textToImage({
            model: modelId,
            provider: "auto",
            inputs: request.prompt,
            parameters: {
                width: request.width ?? 1024,
                height: request.height ?? 1024,
                // @ts-ignore - negative prompt support
                negative_prompt: request.negativePrompt || undefined,
                num_inference_steps: modelKey === "flux-schnell" ? 4 : 28,
                guidance_scale: modelKey === "flux-schnell" ? undefined : 7.5,
            }
        });

        const buffer = Buffer.from(await image.arrayBuffer());

        console.log("HF Image Size:", buffer.length, "bytes");

        return {
            provider: this.name,
            imageBase64: buffer.toString("base64"),
            revisedPrompt: request.prompt
        };
    }
}