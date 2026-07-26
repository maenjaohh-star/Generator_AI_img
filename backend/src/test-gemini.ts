import "dotenv/config";
import { GeminiProvider } from "./providers/gemini.provider";

async function main() {

    const provider = new GeminiProvider();

    const result = await provider.generate({

        prompt:
            "Minimal flat vector illustration of coffee cup, simple geometric shapes, isolated on white background, SVG friendly",

    });

    console.log(result);

}

main().catch(console.error);