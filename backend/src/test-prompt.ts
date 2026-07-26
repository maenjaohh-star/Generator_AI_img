import { PromptEngine } from "./prompt/prompt.engine";

const result = PromptEngine.process({
    subject: "coffee cup",
    style: "flat-vector",
    variation: true,
    variationCount: 4
});

console.log(result);