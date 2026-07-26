import { GoogleGenAI } from "@google/genai";
import { buildMetadataPrompt } from "./metadata.prompt";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
});

export interface MetadataResult {

    title: string;

    keywords: string;

    category: string;

}

export class MetadataService {

    private static fallback(
        prompt: string
    ): MetadataResult {

        const title =
            prompt
                .replace(/\s+/g, " ")
                .trim()
                .substring(0, 70);

        const keywords = Array.from(

   	    new Set(

      		prompt

           	    .toLowerCase()

           	    .replace(/[^a-z0-9 ]/g, "")

           	    .split(/\s+/)

            	    .filter(Boolean)
                                      	  
   	    )

        )

        .slice(0, 49)

        .join(",");

        return {

            title,

            keywords,

            category: "Graphic Resources"

        };

    }
    

    private static clean(
   	metadata: MetadataResult
    ): MetadataResult {

   	const stopWords = new Set([

       	    "illustration",
       	    "illustrations",
       	    "graphic",
       	    "graphics",
       	    "art",
       	    "clipart",
       	    "clip",
       	    "design",
       	    "modern",
       	    "clean",
       	    "simple",
       	    "isolated",
       	    "background",
       	    "shadow",
       	    "logo",
       	    "logos",
       	    "text",
       	    "watermark",
       	    "commercial",
       	    "quality",
       	    "consistency",
       	    "stock",
       	    "adobe",
       	    "high",
       	    "friendly",
       	    "center",
       	    "centered",
       	    "composition",
       	    "pure",
       	    "basic",
       	    "essential",
       	    "template",
       	    "professional",
       	    "contemporary",
       	    "identity"
   	]);

   	const removePhrases = [

       	    "white background",
       	    "isolated on white",
       	    "solid color",
       	    "solid colour",
       	    "simple illustration",
       	    "graphic illustration",
       	    "vector illustration",
       	    "clean modern design",
       	    "modern design",
       	    "minimal design",
       	    "graphic design",
       	    "graphic art",
       	    "vector art",
       	    "digital art",
       	    "clip art",
       	    "web icon",
       	    "app icon",
       	    "simple graphic",
       	    "no shadow",
       	    "no logo",
       	    "no text",
       	    "high consistency",
       	    "svg friendly"

   	];

   	let keywordText =
            metadata.keywords.toLowerCase();

   	for (const phrase of removePhrases) {

            keywordText =
           	 keywordText.replaceAll(
               	     phrase,
                     ""
           	 );

   	}

   	const keywords =
            Array.from(

                new Set(

                    keywordText

                        .split(",")

                        .map(k => k.trim())

                        .filter(Boolean)

                        .filter(k => !stopWords.has(k))
			
                        .sort((a, b) => {

  			    const important = [

       				"icon",
       				"vector",
       				"flat",
       				"minimal",
       				"logo",
       				"symbol"

  			    ];

  			    const pa =
  			        important.includes(a)
           			     ? 0
           			     : 1;

  			    const pb =
  			        important.includes(b)
           			     ? 0
           			     : 1;

 			    return pa - pb;

                        })

                )

            )

            .slice(0, 49)

            .join(",");

   	const title = metadata.title

   	    .replace(/illustration/gi, "")

   	    .replace(/graphic/gi, "")

   	    .replace(/\s+/g, " ")

   	    .trim()

   	    .substring(0, 70);

   	return {

            title,

            keywords,

            category:
                metadata.category ||
                "Graphic Resources"

   	};

    }

    static async generate(
        prompt: string
    ): Promise<MetadataResult> {

        try {

            const fullPrompt =
                buildMetadataPrompt(prompt);

            const response =
                await ai.models.generateContent({

                    model: "gemini-2.5-flash",

                    contents: fullPrompt

                });

            const text =
  		response.text ?? "";

	    console.log("========== GEMINI RAW ==========");
	    console.log(text);

	    const cleanText = text
   	        .replace(/```json/gi, "")
   	        .replace(/```/g, "")
   	        .trim();

	    console.log("========== GEMINI CLEAN ==========");
	    console.log(cleanText);

	    const metadata =
    		JSON.parse(cleanText);

	    console.log("========== BEFORE CLEAN ==========");
	    console.dir(metadata, { depth: null });

	    const cleaned =
    		this.clean(metadata);

	    console.log("========== AFTER CLEAN ==========");
	    console.dir(cleaned, { depth: null });

	    return cleaned;

	    
        }

        catch (error) {

   	    console.error("========== METADATA ERROR ==========");
   	    console.error(error);
   	    console.error(error instanceof Error ? error.stack : error);
   	    console.error("====================================");

   	    console.warn(
        	"Metadata AI gagal, menggunakan fallback."
  	    );

            return this.fallback(prompt);
        }

    }

}