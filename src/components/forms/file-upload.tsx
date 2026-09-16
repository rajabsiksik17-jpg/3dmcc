"use client";

import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  storagePath: string;
  name: string;
  size: number;
  mimeType: string;
}

export function FileUpload({
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  multiple = false,
  value,
  onChange,
}: {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  value?: UploadedFile[] | null;
  onChange?: (files: UploadedFile[]) => void;
}) {
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const files = value ?? [];

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const allowed = accept.split(",").map((a) => a.trim().replace(".", "").toLowerCase());

    const selected = Array.from(fileList);
    for (const file of selected) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!allowed.includes(ext)) {
        setError(
          locale === "ar" ? "نوع الملف غير مسموح به." : "This file type is not allowed."
        );
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(
          locale === "ar"
            ? `حجم الملف كبير جداً (الحد الأقصى ${maxSizeMB} ميجابايت).`
            : `File is too large (max ${maxSizeMB} MB).`
        );
        return;
      }
    }

    setUploading(true);
    const uploaded: UploadedFile[] = [];
    for (const file of selected) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setError(json?.error ?? (locale === "ar" ? "فشل رفع الملف." : "Upload failed."));
        setUploading(false);
        return;
      }
      const json = await res.json();
      uploaded.push({ storagePath: json.path, name: file.name, size: file.size, mimeType: file.type });
    }
    setUploading(false);
    onChange?.(multiple ? [...files, ...uploaded] : uploaded);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    onChange?.(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-charcoal-300 bg-white px-4 py-6 text-sm font-medium text-charcoal-600 transition-colors hover:border-brand-400 hover:text-brand-600",
          uploading && "opacity-60"
        )}
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Upload className="h-5 w-5" />
        )}
        {uploading
          ? locale === "ar" ? "جارٍ الرفع..." : "Uploading..."
          : locale === "ar" ? "اختر ملفاً أو اسحبه هنا" : "Choose a file or drag it here"}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-2 rounded-lg bg-charcoal-50 px-3 py-2 text-sm text-charcoal-700"
            >
              <FileText className="h-4 w-4 shrink-0 text-brand-500" />
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-xs text-charcoal-400">
                {(f.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-charcoal-400 hover:text-red-500"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
