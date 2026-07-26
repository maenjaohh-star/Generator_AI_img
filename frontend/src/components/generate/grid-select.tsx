"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const GRID_OPTIONS = [
  { value: "", label: "🖼️ Single (No Grid)" },
  { value: "2x2", label: "📐 2×2 (4 icons)" },
  { value: "3x2", label: "📐 3×2 (6 icons)" },
  { value: "3x3", label: "📐 3×3 (9 icons)" },
  { value: "4x3", label: "📐 4×3 (12 icons)" },
  { value: "4x4", label: "📐 4×4 (16 icons)" },
];

export default function GridSelect({ value, onChange, disabled }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <span>📐 Grid Layout</span>
        {value && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
            Icon Set
          </span>
        )}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border px-3 py-2 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {GRID_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {value && (
        <p className="text-xs text-gray-400">
          Generate {value.split("x")[0]}×{value.split("x")[1]} icon set dalam 1 gambar
        </p>
      )}
    </div>
  );
}