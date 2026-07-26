import { z } from "zod";

export const GenerateSchema = z.object({

    subject: z
        .string()
        .min(2)
        .max(200),

    style: z
        .string()
        .optional(),

    template: z
        .string()
        .optional(),

    model: z
        .string()
        .optional()
        .default("auto"),

    variation: z
        .boolean()
        .optional()
        .default(false),

    variationCount: z
        .number()
        .min(1)
        .max(10)
        .optional()
        .default(1),

    count: z
        .number()
        .min(1)
        .max(20)
        .optional()
        .default(1),

    grid: z                      
        .string()
        .optional(),

    providerModel: z             
        .string()
        .optional(),

    background: z
        .string()
        .optional(),

    width: z.number().optional(),
    height: z.number().optional(),

}).refine(

    (data) => data.style || data.template,

    {

        message: "Style atau template harus dipilih.",

        path: ["style"]

    }

);

export type GenerateInput = z.infer<typeof GenerateSchema>;




