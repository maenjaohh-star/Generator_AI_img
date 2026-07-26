export interface GenerateImageRequest {
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    seed?: number;
}

export interface GeneratedImage {

    provider: string;

    imageUrl?: string;

    imageBase64?: string;

    revisedPrompt?: string;

}

export interface ImageProvider {

    name: string;

    generate(
        request: GenerateImageRequest
    ): Promise<GeneratedImage>;

}