"use client";

import { useState, useEffect } from "react";
import { getAsset } from "@/services/asset.service";
import SubjectInput from "./subject-input";
import TemplateSelect from "./template-select";
import VariationCard from "./variation-card";
import GenerateButton from "./generate-button";
import { useGenerate } from "@/hooks/useGenerate";
import { useJobs } from "@/hooks/useJobs";
import ModelSelect from "./model-select";
import GridSelect from "./grid-select";
import BackgroundSelect from "./background-select";

export default function GenerateForm() {
  const [subject, setSubject] = useState("");
  const [template, setTemplate] = useState("flat-vector");
  const [provider, setProvider] = useState("auto");
  const [selectedModel, setSelectedModel] = useState("auto");
  const [variation, setVariation] = useState(false);
  const [variationCount, setVariationCount] = useState(1);
  const [count, setCount] = useState(1);
  const [grid, setGrid] = useState("");
  const [background, setBackground] = useState("white");
  const [resolution, setResolution] = useState("1024x1024");

  const [jobs, setJobs] = useState<{ jobId: string; assetId: string }[]>([]);
  const [generatedAssets, setGeneratedAssets] = useState<any[]>([]);

  const mutation = useGenerate();
  const jobQueries = useJobs(jobs);

  const completedJobs = jobQueries.filter(
    (q) => q.data?.data?.status === "completed"
  ).length;

  const jobStatusMap = jobs.map((job, index) => ({
    assetId: job.assetId,
    jobId: job.jobId,
    status: jobQueries[index]?.data?.data?.status ?? "queued",
    progress: jobQueries[index]?.data?.data?.progress ?? 0,
  }));

  const progress =
    jobs.length === 0 ? 0 : Math.round((completedJobs / jobs.length) * 100);

  // Reset grid ketika template gak support
  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
    if (newTemplate !== "flat-vector" && newTemplate !== "icon") {
      setGrid("");
    }
  };

  useEffect(() => {
    jobQueries.forEach(async (query, index) => {
      const job = query.data?.data;
      if (!job) return;
      if (job.status !== "completed") return;

      const assetId = jobs[index]?.assetId;
      if (!assetId) return;

      try {
        const response = await getAsset(assetId);
        const newAsset = response.data;

        setGeneratedAssets((prev) => {
          if (prev.some((a) => a.id === newAsset.id)) {
            return prev;
          }
          return [...prev, newAsset];
        });
      } catch (err) {
        console.error(err);
      }
    });
  }, [jobQueries]);

  // Cek apakah grid support aktif
  const showGrid = template === "flat-vector" || template === "icon";

  // Parse resolution
  const [resWidth, resHeight] = resolution.split("x").map(Number);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-4 space-y-6">
        <SubjectInput value={subject} onChange={setSubject} />
        <TemplateSelect value={template} onChange={handleTemplateChange} />

        <ModelSelect
          provider={provider}
          model={selectedModel}
          onProviderChange={setProvider}
          onModelChange={setSelectedModel}
        />

        {/* Grid Select — hanya untuk flat-vector & icon */}
        {showGrid && (
          <GridSelect value={grid} onChange={setGrid} />
        )}

        <VariationCard
          enabled={variation}
          count={count}
          onEnable={setVariation}
          onCount={setCount}
        />

        {/* Resolution Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">📐 Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 bg-white"
          >
            <option value="512x512">512×512 (Fast)</option>
            <option value="768x768">768×768 (Good)</option>
            <option value="1024x1024">1024×1024 (HD)</option>
            <option value="1536x1536">1536×1536 (2K)</option>
            <option value="2048x2048">2048×2048 (2K+)</option>
          </select>
        </div>

        {/* Background Select */}
        <BackgroundSelect value={background} onChange={setBackground} />

        <GenerateButton
          loading={mutation.isPending}
          onClick={() => {
            const payload = {
              subject,
              template: undefined,
              style: template,
              model: provider,
              providerModel: selectedModel,
              variation,
              variationCount,
              count,
              grid: showGrid ? grid : "",
              background,
              width: resWidth,
              height: resHeight,
            };

            console.log("🔵🔵🔵 PAYLOAD YANG DIKIRIM 🔵🔵🔵");
            console.log(JSON.stringify(payload, null, 2));
            console.log("🔵 resolution:", resolution);
            console.log("🔵 background:", payload.background);
            console.log("🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵");

            mutation.mutate(payload as any, {
              onSuccess: (data: any) => {
                setJobs(data.jobs);
                setGeneratedAssets([]);
              },
            });
          }}
        />

        {jobs.length > 0 && (
          <div className="rounded-xl border bg-white p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>
                {grid ? `Generating ${grid} Icon Set` : `Generating Images (${resolution})`}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {completedJobs} / {jobs.length} Images Generated
            </div>
          </div>
        )}
      </div>

      <div className="col-span-8">
        <h2 className="text-2xl font-bold mb-6">
          {grid ? `Icon Set ${grid}` : "Generated Images"}
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {generatedAssets.map((asset) => {
            const job = jobStatusMap.find((j) => j.assetId === asset.id);
            return (
              <div
                key={asset.id}
                className="rounded-xl border bg-white shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={`http://localhost:5000${asset.imageUrl}`}
                  className="w-full aspect-square object-cover"
                  alt={asset.title}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {asset.title}
                  </h3>

                  {/* Provider & Model & Icon Set Badge */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {asset.provider && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                        {asset.provider}
                      </span>
                    )}
                    {asset.model && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {asset.model}
                      </span>
                    )}
                    {asset.category === "icon-set" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        📐 Icon Set
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          job?.status === "completed"
                            ? "bg-green-500"
                            : "bg-blue-500 animate-pulse"
                        }`}
                        style={{ width: `${job?.progress ?? 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-gray-500">
                      <span className="capitalize">
                        {job?.status ?? "queued"}
                      </span>
                      <span>{job?.progress ?? 0}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                    {asset.category || "Uncategorized"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {generatedAssets.length === 0 && jobs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🎨</p>
            <p className="text-lg font-medium">No images generated yet</p>
            <p className="text-sm mt-1">
              Fill in the form and click generate!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}