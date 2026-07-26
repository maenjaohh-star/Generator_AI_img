export interface PromptScore {

    score: number;

    suggestions: string[];

    passed: boolean;

}

const PositiveKeywords = [

    "flat",

    "vector",

    "minimal",

    "clean",

    "isolated",

    "commercial",

    "svg",

    "stock",

    "white background",

    "center"

];

export function scorePrompt(
    prompt: string
): PromptScore {

    let score = 50;

    const suggestions: string[] = [];

    const lower = prompt.toLowerCase();

    PositiveKeywords.forEach(keyword => {

        if (lower.includes(keyword)) {

            score += 5;

        }

    });

    if (!lower.includes("white background")) {

        suggestions.push(
            "Tambahkan white background"
        );

    }

    if (!lower.includes("vector")) {

        suggestions.push(
            "Tambahkan vector style"
        );

    }

    if (!lower.includes("flat")) {

        suggestions.push(
            "Tambahkan flat illustration"
        );

    }

    if (!lower.includes("commercial")) {

        suggestions.push(
            "Tambahkan commercial quality"
        );

    }

    if (score > 100) {

        score = 100;

    }

    return {

        score,

        suggestions,

        passed: score >= 80

    };

}