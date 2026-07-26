"use client";

console.log("GALLERY PAGE BERJALAN");

import { useState } from "react";
import { useGallery } from "@/hooks/useGallery";
import GalleryCard from "@/components/gallery/gallery-card";
import ImagePreview from "@/components/gallery/image-preview";
import { useDeleteAsset } from "@/hooks/useDeleteAsset";
import { useDownloadZip } from "@/hooks/useDownloadZip";

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [upscale, setUpscale] = useState(true); // Default: upscale ON
  const [scaleFactor, setScaleFactor] = useState(2); // Default: 2x

  const gallery = useGallery(1, search);
  console.log("========== GALLERY ==========");
  console.log(gallery.data);
  console.log("TYPE =", Array.isArray(gallery.data?.data));
  console.log("LENGTH =", gallery.data?.data?.length);
  console.log("=============================");

  const deleteMutation = useDeleteAsset();
  const downloadMutation = useDownloadZip();

  function toggleSelection(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="text-gray-500">Semua asset AI milik Anda</p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari asset..."
        className="w-full rounded-xl border px-5 py-3"
      />

      {/* Upscale Toggle */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={upscale}
            onChange={(e) => setUpscale(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">🔍 Upscale saat download</span>
        </label>
        
        {upscale && (
          <select
            value={scaleFactor}
            onChange={(e) => setScaleFactor(Number(e.target.value))}
            className="rounded-lg border px-3 py-1 text-sm"
          >
            <option value={2}>2x</option>
            <option value={3}>3x</option>
            <option value={4}>4x</option>
          </select>
        )}
      </div>

      {/* Selected Assets Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-40 rounded-xl bg-white border shadow p-4 flex items-center justify-between">
          <div>
            <strong>{selectedIds.length}</strong> {" "}asset dipilih
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 rounded-lg border"
            >
              Clear
            </button>
            <button
              onClick={() =>
                downloadMutation.mutate({
                    ids: selectedIds,
                    options: {
                        upscale,
                        scale: scaleFactor,
                    },
                })
              }
              disabled={downloadMutation.isPending}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              {downloadMutation.isPending
                ? "Membuat ZIP..."
                : upscale
                ? `Download ZIP (${scaleFactor}x)`
                : "Download ZIP"}
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {gallery.data?.data?.map((asset: any) => (
          <GalleryCard
            key={asset.id}
            asset={asset}
            selected={selectedIds.includes(asset.id)}
            onSelect={toggleSelection}
            onPreview={(asset) => setSelectedAsset(asset)}
          />
        ))}
      </div>

      {/* Image Preview Modal */}
      <ImagePreview
        open={!!selectedAsset}
        image={
          selectedAsset
            ? `http://localhost:5000${selectedAsset.imageUrl}`
            : ""
        }
        title={selectedAsset?.title}
        onClose={() => setSelectedAsset(null)}
        onDownload={() => {
          if (!selectedAsset) return;
          
          // Build URL dengan parameter upscale
          const params = new URLSearchParams();
          if (upscale) {
            params.set("upscale", "true");
            params.set("scale", scaleFactor.toString());
          }
          
          const url = `http://localhost:5000/api/assets/${selectedAsset.id}/download${
            params.toString() ? `?${params.toString()}` : ""
          }`;
          
          console.log("Download URL:", url);
          window.open(url, "_blank");
        }}
        onDelete={() => {
          if (!selectedAsset) return;
          if (confirm("Hapus asset ini?")) {
            deleteMutation.mutate(selectedAsset.id, {
              onSuccess() {
                setSelectedAsset(null);
              },
            });
          }
        }}
      />
    </div>
  );
}