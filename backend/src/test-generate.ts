import "dotenv/config";

import { GenerateService } from "./services/generate.service";


async function main(){

    try {

        const result =
            await GenerateService.generate({

                userId:
                "6c1db236-09bd-40a7-87c2-9ca385e32186",

                subject:
                "coffee cup",

                style:
                "flat-vector",

                variation:
                true,

                variationCount:
                4

            });


        console.log(
            "HASIL GENERATE:"
        );


        console.log(result);


    } catch(error){

        console.error(
            "Generate Error:",
            error
        );

    }

}


main();