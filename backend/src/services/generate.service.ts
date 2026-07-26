import prisma from "../config/prisma";
import { PromptEngine } from "../prompt/prompt.engine";
import { ProviderFactory } from "../providers/provider.factory";
import { StorageService } from "../storage/storage.service";
import { logger } from "../logger/logger";
import { HttpError } from "../utils/http-error";
import { updateGeneratedAsset } from "./asset.service";
import { MetadataService } from "../metadata/metadata.service";
import { JobManager } from "../jobs/job.manager";
import { OptimizerService } from "../prompt/optimizer/optimizer.service";
import { DictionaryService } from "../prompt/dictionary/dictionary.service";
import { GridComposer } from "./grid-composer.service";
import { UpscaleService } from "./upscale.service";

console.log("########################################");
console.log("GENERATE SERVICE FILE LOADED");
console.log("########################################");

export interface GenerateAssetRequest {
  assetId: string;
  userId: string;
  subject: string;
  template?: string;
  model?: string;
  style: any;
  variation: boolean;
  variationCount: number;
  jobId?: string;
  grid?: string;
  providerModel?: string;
  background?: string;
}

export class GenerateService {
  private static buildPrompt(request: GenerateAssetRequest) {
    console.log("🔴🔴 buildPrompt request.background:", request.background);
    console.log("🔴🔴 buildPrompt FULL request:", JSON.stringify({
        background: request.background,
        grid: request.grid,
        style: request.style,
        template: request.template,
    }));

    return PromptEngine.process({
      subject: request.subject,
      template: request.template,
      style: request.style,
      variation: request.variation,
      variationCount: request.variationCount,
      grid: request.grid,
      background: request.background,
    });
  }

  private static async generateImage(
    prompt: string,
    model: string = "auto",
    negativePrompt?: string,
    providerModel?: string,
    seed?: number
  ) {
    console.log("========== GENERATE IMAGE ==========");
    console.log("Model :", model);
    console.log("Prompt:", prompt);
    console.log("====================================");

    const providers = ProviderFactory.getProviders(model);

    for (const provider of providers) {
      try {
        console.log("Using Provider:", provider.name);

        const image = await provider.generate({
          prompt,
          negativePrompt,
          model: providerModel,
          seed,
        } as any);

        return {
          provider: provider.name,
          image,
        };
      } catch (error) {
        logger.warn(
          { provider: provider.name, error },
          "Provider gagal, mencoba provider berikutnya..."
        );
      }
    }

    throw new HttpError(503, "Semua provider image sedang gagal.");
  }

  private static saveImage(imageBase64: string) {
    return StorageService.saveBase64(imageBase64);
  }

  static async generate(request: GenerateAssetRequest) {
    try {
      console.log("========== GENERATE SERVICE ==========");
      console.dir(request, { depth: null });
      console.log("======================================");

      // Optimize subject
      let optimizedSubject = request.subject;

      if (!request.grid) {
        console.log("SEBELUM OPTIMIZER");
        const optimized = await OptimizerService.optimize(request.subject);
        const enhanced = DictionaryService.enhance(optimized.optimized);
        optimizedSubject = enhanced;
        console.log("SESUDAH OPTIMIZER");
        console.dir(optimized);
      } else {
        console.log("Grid mode — skipping optimizer");
      }

      request.subject = optimizedSubject;

      const promptResult = this.buildPrompt(request);
      console.log("========== FINAL PROMPT ==========");
      console.dir(promptResult, { depth: null });
      console.log("==================================");

      if (request.jobId) {
        JobManager.update(request.jobId, { progress: 20 });
      }

      // ============================================================
      // GRID MODE: Generate multiple images & compose grid
      // ============================================================
      if (request.grid) {
        const [cols, rows] = request.grid.split("x").map(Number);
        const totalCells = cols * rows;

        console.log(`Grid mode: generating ${totalCells} images...`);

        const gridImages: Buffer[] = [];
        let provider = "unknown";

        for (let i = 0; i < totalCells; i++) {
          if (request.jobId) {
            JobManager.update(request.jobId, {
              progress: 20 + Math.round((i / totalCells) * 40),
            });
          }

          const generated = await this.generateImage(
            `beautiful minimal flat vector illustration of ${request.subject}, clean geometric design, vibrant solid colors, professional quality, masterpiece`,
            request.model ?? "auto",
            promptResult.negativePrompt,
            request.providerModel,
            Math.floor(Math.random() * 999999999)
          );

          gridImages.push(Buffer.from(generated.image.imageBase64, "base64"));
          provider = generated.provider;
        }

        if (request.jobId) {
          JobManager.update(request.jobId, { progress: 60 });
        }

        // Gabungin jadi grid
        const gridBuffer = await GridComposer.composeGrid(gridImages, cols, rows, 512, 12);
        const finalBase64 = gridBuffer.toString("base64");
        const storedImage = this.saveImage(finalBase64);

        console.log("========== IMAGE SAVED ==========");
        console.dir(storedImage, { depth: null });

        if (request.jobId) {
          JobManager.update(request.jobId, { progress: 80 });
        }

        const metadata = await MetadataService.generate(promptResult.prompts[0]);

        console.log("========== UPDATE DATABASE ==========");

        const asset = await updateGeneratedAsset(request.assetId, {
          provider: provider,
          model: provider,
          imageUrl: storedImage.url,
          status: "completed",
          title: `${metadata.title} - ${request.grid} Icon Set`,
          keywords: metadata.keywords,
          category: "icon-set",
          optimizedPrompt: request.subject,
          finalPrompt: promptResult.prompts[0],
        });

        console.log("========== DATABASE UPDATED ==========");

        if (request.jobId) {
          JobManager.update(request.jobId, { progress: 95 });
        }

        logger.info({ provider, user: request.userId, image: storedImage.url, grid: request.grid }, "Generate grid berhasil");

        return {
          asset,
          provider,
          optimizedPrompt: request.subject,
          prompt: promptResult,
          metadata,
          image: finalBase64,
          imageUrl: storedImage.url,
        };
      }

      // ============================================================
      // SINGLE MODE
      // ============================================================
      const generated = await this.generateImage(
        promptResult.prompts[0],
        request.model ?? "auto",
        promptResult.negativePrompt,
        request.providerModel
      );

      if (request.jobId) {
        JobManager.update(request.jobId, { progress: 60 });
      }

      // 🔴 AUTO-UPSCALE (2x)
      console.log("Auto-upscaling image...");
      const imageBuffer = Buffer.from(generated.image.imageBase64, "base64");
      const upscaledBuffer = await UpscaleService.upscale(imageBuffer, 2, "png");
      generated.image.imageBase64 = upscaledBuffer.toString("base64");
      console.log("✅ Auto-upscaled image!");

      const storedImage = this.saveImage(generated.image.imageBase64);

      console.log("========== IMAGE SAVED ==========");
      console.dir(storedImage, { depth: null });

      if (request.jobId) {
        JobManager.update(request.jobId, { progress: 80 });
      }

      const metadata = await MetadataService.generate(promptResult.prompts[0]);

      console.log("========== UPDATE DATABASE ==========");

      const asset = await updateGeneratedAsset(request.assetId, {
        provider: generated.provider,
        model: generated.provider,
        imageUrl: storedImage.url,
        status: "completed",
        title: metadata.title,
        keywords: metadata.keywords,
        category: metadata.category,
        optimizedPrompt: optimizedSubject,
        finalPrompt: promptResult.prompts[0],
      });

      console.log("========== DATABASE UPDATED ==========");

      if (request.jobId) {
        JobManager.update(request.jobId, { progress: 95 });
      }

      logger.info({ provider: generated.provider, user: request.userId, image: storedImage.url }, "Generate berhasil");

      return {
        asset,
        provider: generated.provider,
        optimizedPrompt: optimizedSubject,
        prompt: promptResult,
        metadata,
        image: generated.image.imageBase64,
        imageUrl: storedImage.url,
      };
    } catch (error) {
      console.log("========== GENERATE EXCEPTION ==========");
      console.error(error);
      console.error(error instanceof Error ? error.stack : error);
      console.log("========================================");
      throw error;
    }
  }
}