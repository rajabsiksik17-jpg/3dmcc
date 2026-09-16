"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";

export function AdminLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function toggle() {
    const next = locale === "ar" ? "en" : "ar";
    document.cookie = `admin_locale=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-charcoal-600 hover:bg-charcoal-50"
    >
      <Languages className="h-4 w-4" />
      {locale === "ar" ? "English" : "العربية"}
    </button>
  );
}
