export interface PromptTemplate {

    id: string;

    name: string;

    prefix: string;

    style: string[];

    composition: string[];

    technical: string[];

    quality: string[];

    negativePrompt: string;

}

export const PromptTemplates: Record<string, PromptTemplate> = {

    "flat-icon": {

        id: "flat-icon",

        name: "Flat Icon",

        prefix:
            "Minimal flat vector icon of {subject}",

        style: [

    	    "clean geometric shapes",

    	    "modern UI design",

    	    "minimal geometric style",

    	    "professional icon style",

    	    "simple silhouette",

    	    "flat design",

    	    "contemporary vector style",

    	    "sleek modern appearance",

    	    "minimalist visual language",

    	    "clean abstract design",

    	    "balanced visual style",

    	    "simple flat illustration",

    	    "crisp flat illustration",

    	    "modern interface icon",

    	    "pixel perfect icon style",

    	    "rounded modern icon",

    	    "professional application icon",

    	    "material inspired design",

    	    "minimal object illustration",

    	    "premium vector icon"

        ],

        composition: [

            "balanced proportions",

            "consistent visual weight",

            "clean composition",

            "symmetrical layout",

            "centered object",

            "perfect icon alignment",

            "minimal empty space",

            "optimized visual hierarchy",

            "simple object placement",

            "well-balanced spacing",

            "uniform margins",

            "geometric balance",

            "precise object positioning",

            "compact centered layout",

            "clear focal point",

            "consistent shape distribution",

            "modern interface composition",

            "harmonious icon layout",

            "professional visual structure",

            "pixel perfect alignment"

        ],

        technical: [

            "editable SVG vector",

            "pixel perfect",

            "crisp edges",

            "clean bezier paths",

            "scalable vector",

            "smooth vector curves",

            "optimized anchor points",

            "uniform path construction",

            "fully editable artwork",

            "vector friendly",

            "high resolution vector",

            "precise vector drawing",

            "professional SVG asset",

            "AI compatible vector",

            "production-ready vector",

            "lossless scalable illustration",

            "clean object separation",

            "consistent fill shapes",

            "precision vector construction",

            "export-ready SVG"

        ],

        quality: [

            "premium vector illustration",

            "professional commercial quality",

            "high quality icon design",

            "marketplace ready artwork",

            "designer grade vector",

            "studio quality illustration",

            "clean professional finish",

            "industry standard vector",

            "commercial use ready",

            "high end digital artwork",

            "production quality vector",

            "professional graphic asset",

            "modern premium illustration",

            "expertly crafted vector",

            "high precision artwork",

            "portfolio quality design",

            "professional creative asset",

            "premium UI illustration",

            "top quality vector artwork",

            "world class icon design"

        ],

        negativePrompt:
            "photo, realistic, human, face, 3d, shadow, gradient, texture, watermark, text, mockup, background"

    },

    "flat-icon-outline": {

        id: "flat-icon-outline",

        name: "Flat Icon Outline",

        prefix:
            "Minimal outline vector icon of {subject}",

        style: [

            "thin consistent stroke",

            "modern outline style",

            "minimal line art",

            "rounded line caps",

            "professional UI outline icon",

            "clean contour illustration",

            "uniform stroke weight",

            "simple line drawing",

            "elegant outline design",

            "minimal contour style",

            "crisp line vector",

            "interface outline icon",

            "lightweight vector line",

            "monoline illustration",

            "premium outline icon",

            "technical line art",

            "precise outline drawing",

            "smooth stroke design",

            "geometric outline illustration",

            "professional outline vector"

        ],

        composition: [

            "balanced outline proportions",

            "uniform stroke distribution",

            "symmetrical line composition",

            "centered outline object",

            "clean contour placement",

            "consistent line spacing",

            "minimal visual clutter",

            "geometric alignment",

            "precise outline positioning",

            "professional UI layout",

            "equal stroke balance",

            "harmonious line arrangement",

            "clear visual hierarchy",

            "simple outline structure",

            "compact vector composition",

            "balanced negative space",

            "perfect icon framing",

            "minimal line complexity",

            "well-organized contour layout",

            "pixel perfect outline alignment"

        ],

        technical: [

            "editable SVG vector",

            "uniform stroke width",

            "crisp outline paths",

            "clean bezier curves",

            "scalable vector",

            "smooth line construction",

            "optimized anchor points",

            "perfect stroke alignment",

            "fully editable outline artwork",

            "precision line drawing",

            "high resolution vector",

            "consistent contour quality",

            "production-ready vector",

            "professional SVG asset",

            "AI compatible outline vector",

            "lossless scalable illustration",

            "clean stroke expansion",

            "pixel perfect outline",

            "vector line optimization",

            "export-ready SVG"

        ],

        quality: [

            "premium outline vector",

            "professional commercial quality",

            "high quality outline illustration",

            "clean line artwork",

            "designer grade outline icon",

            "studio quality vector",

            "industry standard line art",

            "marketplace ready vector",

            "production quality illustration",

            "professional SVG artwork",

            "modern outline design",

            "high precision line drawing",

            "expertly crafted vector",

            "premium contour illustration",

            "professional creative asset",

            "world class outline icon",

            "high end vector artwork",

            "commercial use ready",

            "portfolio quality illustration",

            "top quality vector asset"

        ],

        negativePrompt:
            "photo, realistic, filled icon, thick outline, 3d, shadow, gradient, texture, watermark, text, mockup, background"

    },

    "sticker": {

        id: "sticker",

        name: "Sticker",

        prefix:
            "Cute sticker illustration of {subject}",

        style: [

            "cute cartoon style",

            "playful kawaii illustration",

            "bold clean outline",

            "vibrant flat colors",

            "friendly sticker design",

            "adorable illustration",

            "happy cartoon appearance",

            "cheerful character style",

            "fun vector illustration",

            "soft rounded artwork",

            "playful graphic design",

            "expressive cute illustration",

            "modern sticker art",

            "colorful cartoon drawing",

            "premium sticker illustration",

            "eye-catching vector style",

            "friendly commercial artwork",

            "high-quality cartoon vector",

            "creative playful design",

            "print-ready sticker style"

        ],

        composition: [

            "centered sticker composition",

            "dynamic playful layout",

            "cute balanced proportions",

            "rounded visual arrangement",

            "expressive character positioning",

            "friendly composition",

            "compact sticker layout",

            "clear focal subject",

            "fun visual balance",

            "playful object placement",

            "balanced decorative elements",

            "eye-catching composition",

            "symmetrical cute layout",

            "cheerful visual hierarchy",

            "soft rounded arrangement",

            "print friendly composition",

            "clean die-cut layout",

            "premium sticker composition",

            "engaging object placement",

            "modern sticker arrangement"

        ],

        technical: [

            "editable SVG vector",

            "print ready die-cut design",

            "smooth vector curves",

            "clean outline construction",

            "high resolution vector",

            "vibrant flat colors",

            "optimized anchor points",

            "fully editable artwork",

            "professional SVG asset",

            "production-ready vector",

            "AI compatible illustration",

            "lossless scalable illustration",

            "crisp printable edges",

            "perfect cut line preparation",

            "consistent fill quality",

            "clean layer separation",

            "commercial print quality",

            "vector optimized artwork",

            "export-ready SVG",

            "premium sticker vector"

        ],

        quality: [

            "premium sticker illustration",

            "professional commercial quality",

            "high quality cartoon artwork",

            "print ready vector",

            "designer grade illustration",

            "studio quality artwork",

            "vibrant premium design",

            "commercial print quality",

            "marketplace ready illustration",

            "production quality vector",

            "professional creative asset",

            "high end sticker artwork",

            "expertly crafted illustration",

            "clean premium finish",

            "portfolio quality design",

            "modern cartoon illustration",

            "top quality vector artwork",

            "professional printable design",

            "world class sticker vector",

            "premium commercial illustration"

        ],

        negativePrompt:
            "photo, realistic, human face, 3d, shadow, watermark, text, mockup, dirty texture, background scene"

    },

    "logo": {

        id: "logo",

        name: "Logo",

        prefix:
            "Modern minimalist logo of {subject}",

        style: [

            "minimal geometric branding",

            "clean negative space",

            "timeless logo design",

            "modern corporate identity",

            "professional brand mark",

            "abstract symbol design",

            "luxury branding style",

            "premium minimalist logo",

            "simple monogram style",

            "contemporary identity design",

            "clean visual branding",

            "bold symbolic logo",

            "professional vector branding",

            "modern business identity",

            "iconic logo construction",

            "scalable brand symbol",

            "award-winning logo style",

            "corporate visual identity",

            "elegant branding concept",

            "premium logo illustration"

        ],

        composition: [

            "balanced logo construction",

            "perfect visual balance",

            "symmetrical branding layout",

            "clean negative space usage",

            "minimal composition",

            "icon centered layout",

            "strong visual hierarchy",

            "geometric logo balance",

            "professional brand structure",

            "memorable silhouette",

            "simple brand composition",

            "harmonious logo arrangement",

            "precise symbol positioning",

            "timeless visual structure",

            "premium logo composition",

            "corporate visual balance",

            "optimized branding proportions",

            "clean mark placement",

            "modern identity composition",

            "professional layout structure"

        ],

        technical: [

            "editable SVG vector",

            "clean geometric construction",

            "precise vector paths",

            "perfect symmetry",

            "optimized anchor points",

            "scalable branding artwork",

            "professional SVG asset",

            "fully editable logo",

            "lossless scalable illustration",

            "high resolution vector",

            "minimal node count",

            "balanced vector construction",

            "crisp bezier curves",

            "production-ready branding asset",

            "AI compatible vector",

            "precision logo drawing",

            "clean negative space execution",

            "export-ready SVG",

            "commercial branding quality",

            "premium vector artwork"

        ],

        quality: [

            "premium logo design",

            "professional branding quality",

            "high quality vector logo",

            "designer grade branding",

            "studio quality identity design",

            "commercial ready logo",

            "production quality branding",

            "industry standard logo",

            "modern premium identity",

            "expertly crafted brand mark",

            "high precision logo artwork",

            "clean professional finish",

            "portfolio quality branding",

            "timeless premium logo",

            "professional creative asset",

            "top quality vector branding",

            "world class logo design",

            "premium identity illustration",

            "luxury branding quality",

            "high end commercial artwork"

        ],

        negativePrompt:
            "photo, realistic, mascot, watermark, text, slogan, mockup, shadow, gradient, texture, 3d"

    }

};
