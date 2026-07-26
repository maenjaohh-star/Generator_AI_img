import { HttpError } from "../utils/http-error";
import { PromptTemplates } from "./prompt.templates";
import { PromptStyle } from "./prompt.types";

const QUALITY_BOOST = `professional quality, trending, high resolution, masterpiece`;

const BACKGROUND_PROMPTS: Record<string, string> = {
  white: "white background",
  transparent: "transparent background, no background",
  black: "dark background, black background",
  "pastel-blue": "soft pastel blue background",
  "pastel-pink": "soft pastel pink background",
  gradient: "beautiful gradient background",
};

const NEGATIVE_DEFAULTS: Record<string, string> = {
  "flat-vector": "3d, realistic, photo, shadow, gradient, noise, blurry, low quality",
  "3d-render": "2d, flat, cartoon, low poly, low quality, blurry",
  "watercolor": "digital, vector, flat, sharp lines, low quality",
  "anime": "realistic, 3d, photo, western style, low quality",
  "pixel-art": "smooth, realistic, high res, blurry, low quality",
};

export function buildPrompt(
  subject: string,
  style: PromptStyle,
  options?: {
    boost?: boolean;
    extraKeywords?: string;
    grid?: string;
    background?: string;
  }
): string {
    console.log("🔴🔴 [prompt.builder] options?.background:", options?.background);

  let templateKey = style as string;

  if (options?.grid && (style === "flat-vector" || style === "icon")) {
    templateKey = "flat-vector-grid";
  }

  let template = PromptTemplates[templateKey];

  if (!template) {
    throw new HttpError(400, `Style '${style}' tidak ditemukan.`);
  }

  let prompt = template
    .replace("{{subject}}", subject)
    .replace(/{{grid}}/g, options?.grid || "3x3");

  // Tambah background
  if (options?.background && options.background !== "none") {
    const bg = BACKGROUND_PROMPTS[options.background] || options.background;
    console.log("🔴 BACKGROUND value:", options.background);
    console.log("🔴 BACKGROUND mapped:", bg);

    prompt = prompt.replace(/,?\s*white background/g, "");
    prompt = prompt.replace(/,?\s*isolated on white background/g, "");
    prompt = prompt.replace(/,?\s*isolated on/g, "");
    prompt += `, ${bg}`;
  }

  if (options?.boost !== false) {
    prompt += `, ${QUALITY_BOOST}`;
  }

  if (options?.extraKeywords) {
    prompt += `, ${options.extraKeywords}`;
  }

  console.log("🔴 FINAL PROMPT (after background):", prompt);

  return prompt.trim();
}

export function getDefaultNegative(style?: string): string {
  if (!style) return "low quality, blurry, ugly, distorted";
  return NEGATIVE_DEFAULTS[style] || "low quality, blurry, ugly, distorted, bad anatomy";
}