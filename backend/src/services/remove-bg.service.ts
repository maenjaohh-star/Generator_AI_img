import { removeBackground } from "@imgly/background-removal";  // ← TANPA "-node"!
import { logger } from "../logger/logger";

export class RemoveBgService {
  static async remove(imageBuffer: Buffer): Promise<Buffer> {
    try {
      console.log("========== REMOVE BACKGROUND ==========");
      console.log("Original size:", `${(imageBuffer.length / 1024).toFixed(1)} KB`);

      // Convert ke base64
      const base64 = imageBuffer.toString("base64");
      const dataUrl = `data:image/png;base64,${base64}`;

      console.log("Processing...");

      const result = await removeBackground(dataUrl, {
        progress: (key: string, current: number, total: number) => {
          console.log(`Progress: ${key} ${Math.round((current / total) * 100)}%`);
        },
      });

      // Result bisa Blob atau ArrayBuffer
      let outputBuffer: Buffer;
      if (result instanceof Blob) {
        const arrayBuffer = await result.arrayBuffer();
        outputBuffer = Buffer.from(arrayBuffer);
      } else {
        outputBuffer = Buffer.from(result as ArrayBuffer);
      }

      console.log("Output size:", `${(outputBuffer.length / 1024).toFixed(1)} KB`);
      console.log("✅ Background removed successfully!");
      console.log("========================================");

      return outputBuffer;
    } catch (error) {
      logger.error(error, "Remove background failed");
      return imageBuffer;
    }
  }

  static async removeFromBase64(imageBase64: string): Promise<string> {
    const buffer = Buffer.from(imageBase64, "base64");
    const result = await this.remove(buffer);
    return result.toString("base64");
  }
}