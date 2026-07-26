export interface PromptTemplate {

    id: string;

    name: string;

    prompt: string;

    negative: string;

}

export const PromptTemplates: Record<string, PromptTemplate> = {

    "flat-icon": {

        id: "flat-icon",

        name: "Flat Icon",

        prompt:
            "Minimal flat vector icon of {{subject}}, clean geometric shape, simple, modern UI icon, SVG friendly, editable vector, isolated on white background, Adobe Stock quality",

        negative:
            "photo, realistic, human, person, face, shadow, gradient, watermark, text, mockup, 3d"

    },

    "flat-icon-outline": {

        id: "flat-icon-outline",

        name: "Flat Icon Outline",

        prompt:
            "Minimal outline flat vector icon of {{subject}}, thin stroke, editable stroke, SVG friendly, isolated on white background, Adobe Stock quality",

        negative:
            "photo, realistic, gradient, shadow, watermark, text, 3d"

    },

    "sticker": {

        id: "sticker",

        name: "Sticker",

        prompt:
            "Cute flat sticker illustration of {{subject}}, colorful, thick outline, die cut sticker, isolated on white background, Adobe Stock quality",

        negative:
            "photo, realistic, watermark, text, mockup"

    },

    "logo": {

        id: "logo",

        name: "Logo",

        prompt:
            "Minimal modern logo of {{subject}}, flat vector, clean geometric design, monochrome friendly, SVG compatible, Adobe Stock quality",

        negative:
            "photo, realistic, mockup, watermark, text, gradient"

    }

};