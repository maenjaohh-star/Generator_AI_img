"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const BACKGROUNDS = [
  { value: "white", label: "⬜ White", prompt: "white background" },
  { value: "transparent", label: "🔲 Transparent", prompt: "transparent background, no background, alpha channel" },
  { value: "black", label: "⬛ Black", prompt: "dark background, black background" },
  { value: "pastel-blue", label: "🟦 Pastel Blue", prompt: "soft pastel blue background" },
  { value: "pastel-pink", label: "🟪 Pastel Pink", prompt: "soft pastel pink background" },
  { value: "gradient", label: "🌈 Gradient", prompt: "beautiful gradient background" },
  { value: "none", label: "🚫 No background spec", prompt: "" },
];

export default function BackgroundSelect({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">🎨 Background</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 bg-white"
      >
        {BACKGROUNDS.map((bg) => (
          <option key={bg.value} value={bg.value}>
            {bg.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-400">
        Tambahkan style background ke prompt
      </p>
    </div>
  );
}