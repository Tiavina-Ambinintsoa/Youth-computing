import { useCallback, useState } from 'react';
import { X, ImagePlus } from 'lucide-react';

interface PhotoUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export function PhotoUploader({
  value,
  onChange,
  maxFiles = 3,
}: PhotoUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const remaining = maxFiles - value.length;
      const newFiles = Array.from(files).slice(0, remaining);
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
      onChange([...value, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [value, onChange, maxFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onChange(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">
        Photos <span className="text-gray-400">(max {maxFiles})</span>
      </span>

      <div className="flex flex-wrap gap-3">
        {previews.map((src, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeFile(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <label className="w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition">
            <ImagePlus size={24} className="text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Ajouter</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>
    </div>
  );
}