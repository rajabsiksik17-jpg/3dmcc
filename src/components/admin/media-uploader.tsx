"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia } from "@/app/admin/actions/content";
import { Upload } from "lucide-react";

export function MediaUploader() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await uploadMedia(formData);
        formRef.current?.reset();
        router.refresh();
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <input
        type="file"
        name="file"
        required
        className="rounded-lg border border-charcoal-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700"
      />
      <button type="submit" className="btn-primary !py-2">
        <Upload className="h-4 w-4" /> Upload
      </button>
    </form>
  );
}
