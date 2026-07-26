import { PromptTemplates } from "./template.library";
import { randomItem } from "./random.util";


export class TemplateService {

    static build(

        template: string,

        subject: string

    ) {

        const item =
            PromptTemplates[template];

        if (!item) {

            throw new Error(

                `Template "${template}" tidak ditemukan.`

            );

        }
	console.log(item);
        const prompt = [

            item.prefix.replace(

                "{subject}",

                subject

            ),

            randomItem(item.style),

            randomItem(item.composition),

            randomItem(item.technical),

            randomItem(item.quality)

        ].join(", ");

        return {

            prompt,

            negativePrompt:
                item.negativePrompt

        };

    }

}