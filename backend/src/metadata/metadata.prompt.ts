export function buildMetadataPrompt(prompt: string) {

    return `
You are an Adobe Stock metadata generator.

Generate JSON only.

Rules:

- title maximum 70 characters
- keywords maximum 49 keywords
- keywords separated by comma
- category must be one of:

Animals
Buildings and Architecture
Business
Drinks
Environment
Food
Graphic Resources
Hobbies and Leisure
Industry
Landscape
Lifestyle
People
Plants and Flowers
Religion
Science
Social Issues
Sports
Technology
Transport
Travel

Return JSON only.

Example:

{
  "title": "...",
  "keywords": "...",
  "category": "Graphic Resources"
}

Prompt:

${prompt}
`;

}