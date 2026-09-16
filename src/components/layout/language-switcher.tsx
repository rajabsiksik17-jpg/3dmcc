"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages } from "lucide-react";
import { useTransition } from "react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = locale === "en" ? "ar" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-charcoal-700 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900"
      }
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
      <span>{locale === "en" ? "العربية" : "English"}</span>
    </button>
  );
}
