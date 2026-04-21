"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const supabase = getSupabaseBrowserClient();
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
        if (data?.publicUrl) {
          onChange(data.publicUrl);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [onChange]
  );

  return (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        {value ? (
          <div className="relative">
            <Image
              src={value}
              alt="Preview"
              width={128}
              height={128}
              className="mx-auto h-auto w-auto object-contain"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-0 right-0 p-1 bg-slate-900 text-white rounded-full hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
        )}
        <div className="flex text-sm text-gray-600">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-slate-700 hover:text-slate-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-400">
            <span>Upload a file</span>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );
}
