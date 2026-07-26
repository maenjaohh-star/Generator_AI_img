import sharp from "sharp";
import { logger } from "../logger/logger";

export class GridComposer {
  /**
   * Gabungin beberapa gambar jadi grid
   */
  static async composeGrid(
    images: Buffer[],
    cols: number,
    rows: number,
    cellSize: number = 512,
    gap: number = 16,
    bgColor: string = "#ffffff"
  ): Promise<Buffer> {
    try {
      const totalWidth = cols * cellSize + (cols + 1) * gap;
      const totalHeight = rows * cellSize + (rows + 1) * gap;

      console.log("========== GRID COMPOSER ==========");
      console.log("Grid:", `${cols}x${rows}`);
      console.log("Images:", images.length);
      console.log("Canvas:", `${totalWidth}x${totalHeight}`);
      console.log("===================================");

      // Resize semua gambar ke cellSize x cellSize
      const resized = await Promise.all(
        images.map((img, index) =>
          sharp(img)
            .resize(cellSize, cellSize, {
              fit: "contain",
              background: { r: 255, g: 255, b: 255, alpha: 0 },
            })
            .toBuffer()
        )
      );

      // Bikin canvas putih
      const canvas = sharp({
        create: {
          width: totalWidth,
          height: totalHeight,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      }).png();

      // Siapkan composite layers
      const composites: any[] = [];

      for (let i = 0; i < resized.length; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;

        const left = gap + col * (cellSize + gap);
        const top = gap + row * (cellSize + gap);

        composites.push({
          input: resized[i],
          top,
          left,
        });
      }

      const result = await canvas.composite(composites).png().toBuffer();

      console.log("Grid composed successfully!");
      console.log("Output size:", `${(result.length / 1024).toFixed(1)} KB`);

      return result;
    } catch (error) {
      logger.error(error, "Grid composer failed");
      // Fallback: return first image
      return images[0];
    }
  }
}