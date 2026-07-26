import {
    ImageProvider,
    GenerateImageRequest,
    GeneratedImage
} from "./provider.types";

export class PollinationsProvider implements ImageProvider {
    name = "Pollinations";

    async generate(
        request: GenerateImageRequest
    ): Promise<GeneratedImage> {
        const prompt = encodeURIComponent(request.prompt);
        
        // Build URL dengan semua parameter
        const url = new URL(`https://image.pollinations.ai/prompt/${prompt}`);
        
        // Model selection (default: flux untuk kualitas terbaik)
        url.searchParams.set('model', (request as any).model || 'flux');
        
        // Resolution
        url.searchParams.set('width', (request.width || 2048).toString());  
        url.searchParams.set('height', (request.height || 2048).toString()); 
        
        // Negative prompt
        if (request.negativePrompt) {
            url.searchParams.set('negative', request.negativePrompt);
        }
        
        // Seed untuk reproducibility
        if (request.seed) {
            url.searchParams.set('seed', request.seed.toString());
        } else {
            url.searchParams.set('seed', Math.floor(Math.random() * 999999999).toString());
        }
        
        // Hilangkan watermark
        url.searchParams.set('nologo', 'true');
        
        console.log("Pollinations URL:", url.toString());
        
        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(
                `Pollinations gagal generate image (${response.status}): ${response.statusText}`
            );
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        console.log("Pollinations Image Size:", buffer.length, "bytes");

        return {
            provider: this.name,
            imageBase64: buffer.toString("base64"),
            revisedPrompt: request.prompt
        };
    }
}