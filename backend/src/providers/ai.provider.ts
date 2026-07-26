export interface AIProvider {

    generateImage(
        prompt:string
    ):Promise<string>;

}