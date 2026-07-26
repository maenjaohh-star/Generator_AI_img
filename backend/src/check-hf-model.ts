import "dotenv/config";

const models = [
    "Tongyi-MAI/Z-Image-Turbo",
    "black-forest-labs/FLUX.1-schnell",
    "krea/Krea-2-Turbo"
];


async function main(){

for(const model of models){

const r = await fetch(
`https://router.huggingface.co/hf-inference/models/${model}`,
{
method:"GET",
headers:{
Authorization:`Bearer ${process.env.HF_API_KEY}`
}
}
);


console.log(
model,
r.status,
await r.text()
);

}

}


main();