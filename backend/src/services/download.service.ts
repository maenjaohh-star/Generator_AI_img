import fs from "fs";
import path from "path";
import os from "os";
import archiver from "archiver";
import { UpscaleService } from "./upscale.service";

export interface ZipOptions {
    upscale?: boolean;
    scale?: number;
    format?: "png" | "jpeg" | "webp";
}

export class DownloadService {
    /**
     * Create ZIP file dari array file paths
     * @param files - Array path file
     * @param options - Opsi upscale (default: no upscale)
     * @returns Path ke file ZIP yang dibuat
     */
    static async createZip(
        files: string[],
        options: ZipOptions = {}
    ): Promise<string> {
        const {
            upscale = false,
            scale = 2,
            format = "png",
        } = options;

        const output = path.join(
            os.tmpdir(),
            `assets-${Date.now()}.zip`
        );

        return new Promise(async (resolve, reject) => {
            try {
                const stream = fs.createWriteStream(output);

                console.log("========== CREATE ZIP ==========");
                console.log("Total Files:", files.length);
                console.log("Upscale:", upscale);
                if (upscale) {
                    console.log("Scale:", `${scale}x`);
                    console.log("Format:", format);
                }
                console.log("=================================");

                const archive = archiver("zip", {
                    zlib: {
                        level: 9,
                    },
                });

                archive.pipe(stream);

                // Proses setiap file
                for (const file of files) {
                    if (!fs.existsSync(file)) {
                        console.warn(`File not found, skipping: ${file}`);
                        continue;
                    }

                    let fileBuffer: Buffer;
                    let fileName: string;

                    // Upscale kalau diminta
                    if (upscale) {
                        try {
                            console.log(`Upscaling: ${path.basename(file)}`);
                            const originalBuffer = fs.readFileSync(file);
                            const upscaledBuffer = await UpscaleService.upscale(
                                originalBuffer,
                                scale,
                                format
                            );

                            fileBuffer = upscaledBuffer;
                            const newExt = format === "jpeg" ? "jpg" : format;
                            const baseName = path.basename(
                                file,
                                path.extname(file)
                            );
                            fileName = `upscaled-${scale}x-${baseName}.${newExt}`;
                        } catch (upscaleError) {
                            console.error(
                                `Upscale failed for ${file}, using original:`,
                                upscaleError
                            );
                            fileBuffer = fs.readFileSync(file);
                            fileName = path.basename(file);
                        }
                    } else {
                        // Original tanpa upscale
                        fileBuffer = fs.readFileSync(file);
                        fileName = path.basename(file);
                    }

                    // Tambahin ke ZIP
                    archive.append(fileBuffer, {
                        name: fileName,
                    });

                    console.log(`Added: ${fileName}`);
                }

                // Finalize archive
                await archive.finalize();

                stream.on("close", () => {
                    const stats = fs.statSync(output);
                    console.log("========== ZIP CREATED ==========");
                    console.log("Path:", output);
                    console.log("Size:", `${(stats.size / 1024).toFixed(1)} KB`);
                    console.log("==================================");
                    resolve(output);
                });

                archive.on("error", (err) => {
                    console.error("Archive error:", err);
                    reject(err);
                });

                stream.on("error", (err) => {
                    console.error("Stream error:", err);
                    reject(err);
                });
            } catch (error) {
                console.error("Create ZIP error:", error);
                reject(error);
            }
        });
    }

    /**
     * Create ZIP dari buffer images (bukan file path)
     * @param images - Array { buffer, filename }
     * @param options - Opsi upscale
     * @returns Path ke file ZIP
     */
    static async createZipFromBuffers(
        images: Array<{ buffer: Buffer; filename: string }>,
        options: ZipOptions = {}
    ): Promise<string> {
        const {
            upscale = false,
            scale = 2,
            format = "png",
        } = options;

        const output = path.join(
            os.tmpdir(),
            `assets-${Date.now()}.zip`
        );

        return new Promise(async (resolve, reject) => {
            try {
                const stream = fs.createWriteStream(output);

                console.log("========== CREATE ZIP FROM BUFFERS ==========");
                console.log("Total Images:", images.length);
                console.log("Upscale:", upscale);
                console.log("=============================================");

                const archive = archiver("zip", {
                    zlib: { level: 9 },
                });

                archive.pipe(stream);

                for (const image of images) {
                    let finalBuffer = image.buffer;
                    let finalName = image.filename;

                    // Upscale kalau diminta
                    if (upscale) {
                        try {
                            const upscaledBuffer = await UpscaleService.upscale(
                                image.buffer,
                                scale,
                                format
                            );
                            finalBuffer = upscaledBuffer;
                            const newExt = format === "jpeg" ? "jpg" : format;
                            const baseName = path.basename(
                                image.filename,
                                path.extname(image.filename)
                            );
                            finalName = `upscaled-${scale}x-${baseName}.${newExt}`;
                        } catch (upscaleError) {
                            console.error(
                                `Upscale failed for ${image.filename}, using original:`,
                                upscaleError
                            );
                        }
                    }

                    archive.append(finalBuffer, { name: finalName });
                }

                await archive.finalize();

                stream.on("close", () => {
                    const stats = fs.statSync(output);
                    console.log("========== ZIP CREATED ==========");
                    console.log("Path:", output);
                    console.log("Size:", `${(stats.size / 1024).toFixed(1)} KB`);
                    console.log("==================================");
                    resolve(output);
                });

                archive.on("error", reject);
                stream.on("error", reject);
            } catch (error) {
                console.error("Create ZIP from buffers error:", error);
                reject(error);
            }
        });
    }

    /**
     * Download single file dengan upscale opsional
     * @param filePath - Path file original
     * @param options - Opsi upscale
     * @returns Buffer file (upscaled atau original)
     */
    static async downloadWithUpscale(
        filePath: string,
        options: ZipOptions = {}
    ): Promise<{ buffer: Buffer; filename: string }> {
        const {
            upscale = false,
            scale = 2,
            format = "png",
        } = options;

        if (!fs.existsSync(filePath)) {
            throw new Error(`File tidak ditemukan: ${filePath}`);
        }

        const originalBuffer = fs.readFileSync(filePath);
        const originalName = path.basename(filePath);

        if (!upscale) {
            return {
                buffer: originalBuffer,
                filename: originalName,
            };
        }

        // Upscale
        try {
            const upscaledBuffer = await UpscaleService.upscale(
                originalBuffer,
                scale,
                format
            );
            const newExt = format === "jpeg" ? "jpg" : format;
            const baseName = path.basename(originalName, path.extname(originalName));
            const newName = `upscaled-${scale}x-${baseName}.${newExt}`;

            return {
                buffer: upscaledBuffer,
                filename: newName,
            };
        } catch (error) {
            console.error("Upscale failed, returning original:", error);
            return {
                buffer: originalBuffer,
                filename: originalName,
            };
        }
    }

    /**
     * Cleanup file temporary
     */
    static cleanup(filePath: string): void {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("Cleaned up:", filePath);
            }
        } catch (error) {
            console.error("Cleanup error:", error);
        }
    }
}