import { buildPrompt, getDefaultNegative } from "./prompt.builder";
import { sanitizePrompt } from "./sanitizer.engine";
import { validateStockPrompt } from "./safety/stock-safe.engine";
import { generateVariations } from "./variation.engine";
import { scorePrompt } from "./score.engine";
import { buildNegativePromptString } from "./negative/negative.engine";
import { PromptStyle } from "./prompt.types";
import { TemplateService } from "./template.service";
import { enhancePrompt } from "./enhancer/prompt-enhancer";

export interface PromptEngineRequest {
  subject: string;
  style?: PromptStyle;
  template?: string;
  variation: boolean;
  variationCount: number;
  grid?: string;
  background?: string;
}

export interface PromptEngineResult {
  prompts: string[];
  negativePrompt: string;
  score: number;
  safe: boolean;
  warnings: string[];
  replacements: string[];
}

export class PromptEngine {
  static process(request: PromptEngineRequest): PromptEngineResult {
      console.log("🔴🔴 [PromptEngine] request.background:", request.background);

    const subjects = generateVariations(request.subject, {
      enabled: request.variation,
      count: request.variationCount,
    });

    const prompts: string[] = [];
    let replacements: string[] = [];
    let negativePrompt = buildNegativePromptString();

    for (const subject of subjects) {
      let builtPrompt: string;

      if (request.template && request.template.trim() !== "") {
        const template = TemplateService.build(request.template, subject);
        builtPrompt = template.prompt;
        negativePrompt = template.negativePrompt;
      } else {
        console.log("🔴🔴🔴 MASUK KE buildPrompt 🔴🔴🔴");
        console.log("🔴 style:", request.style);
        console.log("🔴 grid:", request.grid);
        console.log("🔴 background:", request.background);

        builtPrompt = buildPrompt(subject, request.style!, {
          grid: request.grid,
          background: request.background,
        });

        console.log("🔴 builtPrompt:", builtPrompt.substring(0, 100));

        const styleNegative = getDefaultNegative(request.style as string);
        if (styleNegative) {
          negativePrompt = styleNegative;
        }
      }

      const sanitized = sanitizePrompt(builtPrompt);
      const safe = validateStockPrompt(sanitized.sanitized);

      if (!safe.allowed) {
        throw new Error(`${safe.reason}: ${safe.matched}`);
      }

      prompts.push(
          enhancePrompt(sanitized.sanitized, request.style as string)
      );
    }

    const score = scorePrompt(prompts[0]);

    return {
      prompts,
      negativePrompt,
      score: score.score,
      safe: true,
      warnings: score.suggestions,
      replacements,
    };
  }
}