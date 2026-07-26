import { DefaultNegativePrompt } from "./negative.dictionary";
import { NegativePrompt } from "./negative.types";

export function buildNegativePrompt(): NegativePrompt {

    return {

        items: [...DefaultNegativePrompt]

    };

}

export function buildNegativePromptString(style?: string): string {
  const base = "ugly, distorted, messy, blurry, low quality, bad anatomy, extra limbs, cropped, out of frame, watermark, text, signature";

  if (style === "flat-vector" || style === "icon") {
    return base + ", 3d, realistic, photo, shadow, gradient, noise";
  }

  return base;
}