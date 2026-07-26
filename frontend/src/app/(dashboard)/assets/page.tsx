"use client";

import { useState } from "react";
import { useGallery } from "@/hooks/useGallery";
import GalleryCard from "@/components/gallery/gallery-card";
import ImagePreview from "@/components/gallery/image-preview";
import { useDeleteAsset } from "@/hooks/useDeleteAsset";
import { deleteManyAssets } from "@/services/asset.service";
import { useQueryClient } from "@tanstack/react-query";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [upscale, setUpscale] = useState(true);
  const [scaleFactor, setScaleFactor] = useState(2);
  const [removeBg, setRemoveBg] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const gallery = useGallery(1, search);
  const deleteMutation = useDeleteAsset();
  const queryClient = useQueryClient();

  function toggleSelection(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Download satuan
  const handleDownload = () => {
    if (!selectedAsset) return;

    const params = new URLSearchParams();
    if (upscale) {
      params.set("upscale", "true");
      params.set("scale", scaleFactor.toString());
      params.set("format", "png");
    }
    if (removeBg) {
      params.set("removeBg", "true");
    }

    const queryString = params.toString();
    const url = `http://localhost:5000/api/assets/${selectedAsset.id}/download${queryString ? `?${queryString}` : ""}`;

    console.log("Download URL:", url);
    window.open(url, "_blank");
  };

  // Download ZIP
  const handleDownloadZip = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const params = new URLSearchParams();
      params.set("ids", selectedIds.join(","));
      if (upscale) {
        params.set("upscale", "true");
        params.set("scale", scaleFactor.toString());
        params.set("format", "png");
      }
      if (removeBg) {
        params.set("removeBg", "true");
      }

      const url = `http://localhost:5000/api/assets/download-zip?${params.toString()}`;
      console.log("ZIP URL:", url);

      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;

      let zipName = "assets";
      if (removeBg) zipName = "nobg-" + zipName;
      if (upscale) zipName = `upscaled-${scaleFactor}x-` + zipName;
      a.download = `${zipName}.zip`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      console.log("✅ ZIP Download sukses!");
      setSelectedIds([]);
    } catch (error) {
      console.error("❌ ZIP Download error:", error);
      alert("Gagal download ZIP!");
    } finally {
      setIsDownloading(false);
    }
  };

  // Delete single asset
  const handleDelete = () => {
    console.log("🔴 handleDelete called!");
    console.log("🔴 selectedAsset:", selectedAsset?.id);

    if (!selectedAsset) {
      console.log("🔴 No selected asset!");
      return;
    }

    if (confirm("Hapus asset ini?")) {
      console.log("🔴 Deleting:", selectedAsset.id);
      deleteMutation.mutate(selectedAsset.id, {
        onSuccess: (data: any) => {
          console.log("✅ Delete sukses!", data);
          setSelectedAsset(null);
          gallery.refetch();
        },
        onError: (error: any) => {
          console.error("❌ Delete error:", error);
          alert("Gagal hapus asset!");
        },
      });
    }
  };

  // Delete many assets
  const handleDeleteMany = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      console.log("🔴 Deleting many:", selectedIds);
      await deleteManyAssets(selectedIds);
      console.log("✅ Delete many sukses!");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (error) {
      console.error("❌ Delete many error:", error);
      alert("Gagal hapus asset!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Assets</h1>
        <p className="text-gray-500">Semua asset AI milik Anda</p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari asset..."
        className="w-full rounded-xl border px-5 py-3"
      />

      {/* Options Toggle */}
      <div className="space-y-3 p-4 bg-white rounded-xl border">
        {/* Upscale Toggle */}
        <div className="flex items-center gap-4">
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

        {/* Remove Background Toggle */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeBg}
              onChange={(e) => setRemoveBg(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">🔲 Remove Background (Transparent PNG)</span>
          </label>
        </div>
      </div>

      {/* Selected Assets Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-40 rounded-xl bg-white border shadow p-4 flex items-center justify-between">
          <div>
            <strong>{selectedIds.length}</strong> asset dipilih
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={handleDeleteMany}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Menghapus..." : `🗑 Delete (${selectedIds.length})`}
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isDownloading
                ? "Membuat ZIP..."
                : upscale || removeBg
                ? `Download ZIP${removeBg ? " (No BG)" : ""}${upscale ? ` (${scaleFactor}x)` : ""}`
                : "Download ZIP"}
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {gallery.isLoading && (
          <p className="col-span-full text-center py-10 text-gray-400">Loading...</p>
        )}
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

      {/* Empty State */}
      {gallery.data?.data?.length === 0 && !gallery.isLoading && (
        <div className="col-span-full text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🖼️</p>
          <p className="text-lg font-medium">Belum ada asset</p>
          <p className="text-sm mt-1">Generate gambar dulu di halaman Generate!</p>
        </div>
      )}

      {/* Image Preview Modal */}
      <ImagePreview
        open={!!selectedAsset}
        image={selectedAsset ? `http://localhost:5000${selectedAsset.imageUrl}` : ""}
        title={selectedAsset?.title}
        onClose={() => {
          console.log("⚫ Closing preview");
          setSelectedAsset(null);
        }}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
}