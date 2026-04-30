"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string[];
  onChange: (files: string[]) => void;
  maxCount?: number;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  maxCount = 9,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleSelect = () => {
    inputRef.current?.click();
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remaining = maxCount - value.length;
    if (remaining <= 0) {
      return;
    }

    const toRead = files.slice(0, remaining);
    const readers = toRead.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then((dataUrls) => {
      onChange([...value, ...dataUrls]);
    });

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {value.map((dataUrl, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-md border overflow-hidden bg-muted group"
            >
              <img
                src={dataUrl}
                alt={`图片 ${i + 1}`}
                className="size-full object-cover cursor-pointer"
                onClick={() => setPreviewIndex(previewIndex === i ? null : i)}
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-0.5 right-0.5 flex size-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Full preview overlay */}
      {previewIndex !== null && value[previewIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewIndex(null)}
        >
          <div className="relative max-h-[80vh] max-w-[80vw]">
            <img
              src={value[previewIndex]}
              alt="预览"
              className="max-h-[80vh] max-w-[80vw] rounded-md object-contain"
            />
            <button
              type="button"
              onClick={() => setPreviewIndex(null)}
              className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-background shadow-md border"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelect}
          disabled={disabled || value.length >= maxCount}
        >
          <Upload className="size-3.5 mr-1" />
          上传图片
        </Button>
        <span className="text-xs text-muted-foreground">
          {value.length}/{maxCount} 张{value.length > 0 ? `（点击图片可预览）` : ""}
        </span>
        {value.length >= maxCount && (
          <span className="text-xs text-status-warning">已达上限</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>
    </div>
  );
}
