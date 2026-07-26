import { AIProvider } from "./ai.provider";


export class MockProvider implements AIProvider {


    async generateImage(
        prompt:string
    ):Promise<string>{


        return `storage/generated/${Date.now()}.png`;


    }


}