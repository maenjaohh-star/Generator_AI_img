"use client";

import { useEffect } from "react";
import { X, Download, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  image: string;
  title?: string;
  onClose: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export default function ImagePreview({
  open,
  image,
  title,
  onClose,
  onDownload,
  onDelete,
}: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKey);
    }

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-7xl w-full flex flex-col items-center"
      >
        <img
          src={image}
          className="max-h-[88vh] max-w-full rounded-2xl shadow-2xl object-contain"
          alt={title || "Preview"}
        />

        <div className="mt-5 text-white text-lg font-semibold">{title}</div>

        <div className="absolute top-5 right-5 flex gap-3">
          {/* Download Button */}
          <button
            onClick={() => {
              console.log("🔵 Download button clicked!");
              if (onDownload) {
                console.log("🔵 Calling onDownload...");
                onDownload();
              } else {
                console.log("🔵 onDownload is undefined!");
              }
            }}
            className="bg-white hover:bg-gray-100 rounded-full p-3 transition"
            title="Download"
          >
            <Download size={20} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              console.log("🔴 Delete button clicked!");
              if (onDelete) {
                console.log("🔴 Calling onDelete...");
                onDelete();
              } else {
                console.log("🔴 onDelete is UNDEFINED!");
              }
            }}
            className="bg-white hover:bg-red-100 rounded-full p-3 transition"
            title="Delete"
          >
            <Trash2 size={20} className="text-red-600" />
          </button>

          {/* Close Button */}
          <button
            onClick={() => {
              console.log("⚫ Close button clicked!");
              onClose();
            }}
            className="bg-white hover:bg-gray-100 rounded-full p-3 transition"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}