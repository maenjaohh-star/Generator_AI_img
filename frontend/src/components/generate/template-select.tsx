"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TemplateSelect({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="font-medium">Template</label>
      <Select value={value} onValueChange={(value) => onChange(value || "")}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {/* FLAT & VECTOR */}
          <SelectItem value="flat-vector">Flat Vector</SelectItem>
          <SelectItem value="icon">Icon</SelectItem>
          <SelectItem value="clipart">Clipart</SelectItem>
          <SelectItem value="line-art">Line Art</SelectItem>

          {/* 3D & REALISTIC */}
          <SelectItem value="3d-render">3D Render</SelectItem>
          <SelectItem value="3d-isometric">3D Isometric</SelectItem>
          <SelectItem value="realistic">Realistic Photo</SelectItem>

          {/* ARTISTIC */}
          <SelectItem value="watercolor">Watercolor</SelectItem>
          <SelectItem value="oil-painting">Oil Painting</SelectItem>
          <SelectItem value="pencil-sketch">Pencil Sketch</SelectItem>
          <SelectItem value="digital-painting">Digital Painting</SelectItem>

          {/* ANIME & CARTOON */}
          <SelectItem value="anime">Anime</SelectItem>
          <SelectItem value="chibi">Chibi</SelectItem>
          <SelectItem value="cartoon">Cartoon</SelectItem>

          {/* UI & DESIGN */}
          <SelectItem value="ui-illustration">UI Illustration</SelectItem>
          <SelectItem value="geometric">Geometric</SelectItem>
          <SelectItem value="gradient">Gradient</SelectItem>

          {/* SPECIALTY */}
          <SelectItem value="pixel-art">Pixel Art</SelectItem>
          <SelectItem value="low-poly">Low Poly</SelectItem>
          <SelectItem value="origami">Origami</SelectItem>
          <SelectItem value="neon">Neon</SelectItem>
          <SelectItem value="sticker">Sticker</SelectItem>
          <SelectItem value="minimalist">Minimalist</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}