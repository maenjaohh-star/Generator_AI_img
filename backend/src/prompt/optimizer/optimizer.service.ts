import { GoogleGenAI } from "@google/genai";
import { buildOptimizerPrompt } from "./optimizer.prompt";
import { PromptOptimizationResult } from "./optimizer.types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export class OptimizerService {
  static async optimize(subject: string): Promise<PromptOptimizationResult> {
    try {
      console.log("========== OPTIMIZER ==========");
      console.log("Input:", subject);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: buildOptimizerPrompt(subject),
      });

      const optimized = response.text?.trim() || subject;

      // Safety filter
      const bannedWords = [
        "naked", "nude", "nsfw", "porn", "sex",
        "gore", "violence", "blood", "murder", "kill",
        "weapon", "drug", "racist", "hate",
      ];

      const lower = optimized.toLowerCase();
      if (bannedWords.some((word) => lower.includes(word))) {
        console.warn("⚠️ Safety filter triggered, using original subject");
        return { original: subject, optimized: subject, improved: false };
      }

      // Pastikan optimized lebih deskriptif
      if (optimized.length < subject.length || optimized === subject) {
        console.log("Optimizer returned same/shorter, using original");
        return { original: subject, optimized: subject, improved: false };
      }

      console.log("Output:", optimized);
      console.log("===============================");

      return {
        original: subject,
        optimized,
        improved: optimized !== subject,
      };
    } catch (error) {
      console.error("Optimizer error:", error);
      return { original: subject, optimized: subject, improved: false };
    }
  }
}