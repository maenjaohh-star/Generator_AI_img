// Style enhancers — bikin prompt lebih artistic
const STYLE_BOOSTS = [
  "dribbble trending",
  "behance featured",
  "award-winning design",
  "professional illustration",
  "masterpiece",
  "highly detailed",
  "beautiful composition",
  "stunning artwork",
  "vibrant colors",
  "perfect lighting",
];

// Artist inspirations
const ARTIST_INSPIRATIONS = [
  "inspired by Malika Favre",
  "inspired by Saul Bass",
  "Bauhaus design style",
  "Japanese minimalism",
  "Scandinavian flat design",
  "modern Swiss design",
  "contemporary vector art",
  "premium icon style",
];

// Random pick
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Enhance prompt biar lebih artistic dan berkualitas
 */
export function enhancePrompt(prompt: string, style?: string): string {
  let enhanced = prompt;

  // Tambah 3 random style boosts (lebih banyak!)
  const boosts = new Set<string>();
  while (boosts.size < 3) {
    boosts.add(randomItem(STYLE_BOOSTS));
  }
  enhanced += ", " + [...boosts].join(", ");

  // Tambah artist inspiration (50% chance)
  if (Math.random() > 0.5) {
    enhanced += ", " + randomItem(ARTIST_INSPIRATIONS);
  }

  // Tambah kualitas spesifik untuk style
  if (style === "flat-vector" || style === "icon") {
    enhanced += ", premium vector illustration, UI design quality, marketplace ready";
    enhanced += ", 8K resolution, ultra high detail, sharp focus, crisp lines";
  }

  enhanced = enhanced.replace(/, ,/g, ",").replace(/,\s*,/g, ",").trim();
  
  console.log("🔴 ENHANCED PROMPT:", enhanced);
  
  return enhanced;
}