"use client";

interface ModelOption {
  value: string;
  label: string;
}

const MODELS_BY_PROVIDER: Record<string, ModelOption[]> = {
  auto: [
    { value: "auto", label: "Auto (Smart Router)" },
  ],
  gemini: [
    { value: "gemini", label: "Gemini 2.5 Flash Image" },
  ],
  huggingface: [
    { value: "flux-schnell", label: "FLUX Schnell (Fast)" },
    { value: "flux-dev", label: "FLUX Dev (Quality)" },
    { value: "sdxl", label: "SDXL (Stable Diffusion)" },
    { value: "sd3", label: "SD 3.5 (Latest)" },
    { value: "playground", label: "Playground v2.5 (Aesthetic)" },
  ],
  pollinations: [
    { value: "flux", label: "Flux (Best Quality)" },
    { value: "turbo", label: "Turbo (Fast)" },
  ],
};

const PROVIDERS: ModelOption[] = [
  { value: "auto", label: "🤖 Auto (Smart Router)" },
  { value: "pollinations", label: "🎨 Pollinations (Free)" },
  { value: "huggingface", label: "🤗 HuggingFace (Free Tier)" },
  { value: "gemini", label: "🧠 Gemini (100/day)" },
];

interface Props {
  provider: string;
  model: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

export default function ModelSelect({
  provider,
  model,
  onProviderChange,
  onModelChange,
}: Props) {
  const handleProviderChange = (newProvider: string) => {
    onProviderChange(newProvider);
    // Auto-select first model for the new provider
    const models = MODELS_BY_PROVIDER[newProvider];
    if (models && models.length > 0) {
      onModelChange(models[0].value);
    }
  };

  const availableModels = MODELS_BY_PROVIDER[provider] || [];

  return (
    <div className="space-y-4">
      {/* Provider Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <span>🚀 Provider</span>
          {provider === "auto" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              Auto-failover
            </span>
          )}
          {provider === "pollinations" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Unlimited*
            </span>
          )}
        </label>
        <select
          value={provider}
          onChange={(e) => handleProviderChange(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 bg-white cursor-pointer hover:border-blue-400 transition-colors"
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {provider === "auto" && (
          <p className="text-xs text-gray-400">
            Coba Pollinations → HuggingFace → Gemini secara otomatis
          </p>
        )}
        {provider === "pollinations" && (
          <p className="text-xs text-gray-400">
            Gratis & generous. Kualitas terbaik untuk ilustrasi.
          </p>
        )}
      </div>

      {/* Model Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">🎯 Model</label>
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 bg-white cursor-pointer hover:border-blue-400 transition-colors"
          disabled={availableModels.length <= 1}
        >
          {availableModels.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        {provider === "huggingface" && (
          <p className="text-xs text-gray-400">
            Schnell = Cepat (4 steps) | Dev = Kualitas (28 steps)
          </p>
        )}
        {provider === "pollinations" && (
          <p className="text-xs text-gray-400">
            Flux = Kualitas terbaik | Turbo = 2-5 detik
          </p>
        )}
      </div>
    </div>
  );
}