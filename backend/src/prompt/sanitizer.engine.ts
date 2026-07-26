export interface SanitizedPrompt {

    original: string;

    sanitized: string;

    replaced: string[];

}

const ReplaceDictionary: Record<string, string> = {

    "nike": "running shoes",

    "adidas": "sports shoes",

    "iphone": "smartphone",

    "ipad": "tablet",

    "macbook": "laptop",

    "airpods": "wireless earbuds",

    "apple watch": "smartwatch",

    "tesla": "electric car",

    "ferrari": "sports car",

    "lamborghini": "luxury sports car",

    "bmw": "luxury sedan",

    "mercedes": "luxury sedan",

    "youtube": "video platform",

    "facebook": "social media",

    "instagram": "social media",

    "tiktok": "short video platform",

    "xbox": "game console",

    "playstation": "game console"

};

export function sanitizePrompt(
    prompt: string
): SanitizedPrompt {

    let sanitized = prompt;

    const replaced: string[] = [];

    for (const [keyword, replacement] of Object.entries(ReplaceDictionary)) {

        const regex = new RegExp(keyword, "gi");

        if (regex.test(sanitized)) {

            sanitized = sanitized.replace(regex, replacement);

            replaced.push(keyword);

        }

    }

    sanitized = sanitized
        .replace(/\s+/g, " ")
        .trim();

    return {

        original: prompt,

        sanitized,

        replaced

    };

}