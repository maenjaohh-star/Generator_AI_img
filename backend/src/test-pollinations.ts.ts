import "dotenv/config";

import { PollinationsProvider }
from "./providers/pollinations.provider";


async function main(){

    const provider =
        new PollinationsProvider();


    const result =
        await provider.generate({

            prompt:
            "minimal flat vector illustration of coffee cup, isolated on white background"

        });


    console.log(
        result.provider
    );


    console.log(
        result.imageBase64?.substring(0,100)
    );

}


main()
.catch(console.error);