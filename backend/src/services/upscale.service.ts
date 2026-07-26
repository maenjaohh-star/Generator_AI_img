import sharp from "sharp";
import { logger } from "../logger/logger";

export class UpscaleService {
  /**
   * Upscale image menggunakan Sharp (Lanczos)
   * @param imageBuffer - Buffer dari gambar original
   * @param scale - Faktor upscale (default: 2x)
   * @param format - Format output (default: png)
   * @returns Buffer gambar yang sudah di-upscale
   */
  static async upscale(
    imageBuffer: Buffer,
    scale: number = 2,
    format: "png" | "jpeg" | "webp" = "png"
  ): Promise<Buffer> {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      const originalWidth = metadata.width || 512;
      const originalHeight = metadata.height || 512;

      console.log("========== UPSCALE IMAGE ==========");
      console.log("Original Size:", `${originalWidth}x${originalHeight}`);
      console.log("Scale Factor:", `${scale}x`);
      console.log("Original File Size:", `${(imageBuffer.length / 1024).toFixed(1)} KB`);

      let upscaled = sharp(imageBuffer).resize({
        width: Math.round(originalWidth * scale),
        height: Math.round(originalHeight * scale),
        fit: "fill",
        kernel: "lanczos3",
      });

      // Tambah sharpen untuk hasil lebih tajam
      upscaled = upscaled.sharpen({
        sigma: 1.0,
        m1: 0.5,
        m2: 0.5,
      });

      // Format output
      if (format === "png") {
        upscaled = upscaled.png({
          quality: 100,
          compressionLevel: 6,
        });
      } else if (format === "jpeg") {
        upscaled = upscaled.jpeg({
          quality: 95,
          mozjpeg: true,
        });
      } else if (format === "webp") {
        upscaled = upscaled.webp({
          quality: 95,
          lossless: false,
        });
      }

      const result = await upscaled.toBuffer();

      const newWidth = Math.round(originalWidth * scale);
      const newHeight = Math.round(originalHeight * scale);

      console.log("Upscaled Size:", `${newWidth}x${newHeight}`);
      console.log("Upscaled File Size:", `${(result.length / 1024).toFixed(1)} KB`);
      console.log("Size Increase:", `${((result.length / imageBuffer.length - 1) * 100).toFixed(1)}%`);
      console.log("====================================");

      return result;
    } catch (error) {
      logger.error(error, "Upscale gagal, return original");
      return imageBuffer;
    }
  }

  /**
   * Upscale dari base64 string
   */
  static async upscaleFromBase64(
    imageBase64: string,
    scale: number = 2,
    format: "png" | "jpeg" | "webp" = "png"
  ): Promise<string> {
    const buffer = Buffer.from(imageBase64, "base64");
    const upscaled = await this.upscale(buffer, scale, format);
    return upscaled.toString("base64");
  }

  /**
   * Upscale dari file path
   */
  static async upscaleFromFile(
    filePath: string,
    scale: number = 2,
    format: "png" | "jpeg" | "webp" = "png"
  ): Promise<Buffer> {
    const fs = require("fs");
    const buffer = fs.readFileSync(filePath);
    return this.upscale(buffer, scale, format);
  }
}