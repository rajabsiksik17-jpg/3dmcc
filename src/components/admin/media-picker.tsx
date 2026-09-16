"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { uploadMedia } from "@/app/admin/actions/content";
import { Upload, Search, X, Check, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  name: string;
  url: string | null;
  type: string;
}

export function MediaPicker({
  value,
  onChange,
  onClear,
}: {
  value?: string | null;
  onChange?: (url: string) => void;
  onClear?: () => void;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetch("/api/admin/media")
        .then((r) => r.json())
        .then((d) => setMedia(d.media ?? []))
        .catch(() => {});
    }
  }, [open]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      const res = await uploadMedia(form);
      if (res.ok) {
        const refreshed = await fetch("/api/admin/media").then((r) => r.json());
        setMedia(refreshed.media ?? []);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const filtered = media.filter((m) => !query || m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex items-center gap-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-14 w-14 rounded-lg object-cover border border-charcoal-200" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-charcoal-300 bg-charcoal-50 text-charcoal-300">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <div className="flex flex-1 gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-charcoal-200 px-3 py-2 text-sm font-medium text-charcoal-700 hover:border-brand-400"
          >
            {value ? "Change" : "Select Image"}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-charcoal-200 px-3 py-2 text-sm font-medium text-charcoal-700 hover:border-brand-400"
          >
            <Upload className="inline h-4 w-4 me-1" />
            {uploading ? "..." : "Upload"}
          </button>
          {value && (
            <button type="button" onClick={onClear} className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50">
              Remove
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-charcoal-900">Media Library</h3>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-charcoal-500 hover:bg-charcoal-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-charcoal-200 px-3 py-2">
              <Search className="h-4 w-4 text-charcoal-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search media..."
                className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-charcoal-400"
              />
            </div>
            <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    if (m.url) onChange?.(m.url);
                    setOpen(false);
                  }}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-lg border bg-charcoal-50",
                    value === m.url ? "ring-2 ring-brand-500" : "hover:ring-2 hover:ring-brand-300"
                  )}
                >
                  {m.type === "image" && m.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-charcoal-300">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                  {value === m.url && (
                    <span className="absolute bottom-1 end-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-charcoal-400">No media found. Upload an image first.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
