import { BlockedBrands } from "./blocked-brands";
import { BlockedCharacters } from "./blocked-characters";
import { BlockedLandmarks } from "./blocked-landmarks";
import { BlockedLogos } from "./blocked-logos";

export interface StockSafeResult {

    allowed: boolean;

    reason?: string;

    matched?: string;

}

function containsKeyword(
    prompt: string,
    keywords: string[]
): string | null {

    const lower = prompt.toLowerCase();

    for (const keyword of keywords) {

        if (lower.includes(keyword)) {

            return keyword;

        }

    }

    return null;

}

export function validateStockPrompt(
    prompt: string
): StockSafeResult {

    let hit = containsKeyword(prompt, BlockedCharacters);

    if (hit) {

        return {

            allowed: false,

            reason: "Copyrighted character",

            matched: hit

        };

    }

    hit = containsKeyword(prompt, BlockedBrands);

    if (hit) {

        return {

            allowed: false,

            reason: "Trademark brand",

            matched: hit

        };

    }

    hit = containsKeyword(prompt, BlockedLogos);

    if (hit) {

        return {

            allowed: false,

            reason: "Logo request",

            matched: hit

        };

    }

    hit = containsKeyword(prompt, BlockedLandmarks);

    if (hit) {

        return {

            allowed: false,

            reason: "Restricted landmark",

            matched: hit

        };

    }

    return {

        allowed: true

    };

}