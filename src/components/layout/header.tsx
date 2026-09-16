"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cn, localized } from "@/lib/utils";
import type { CompanySettingsRow, MenuItemRow } from "@/types/database";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export function Header({
  company,
  menuItems,
}: {
  company: CompanySettingsRow | null;
  menuItems: MenuItemRow[];
}) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const name = locale === "ar" ? company?.name_ar ?? "3DMCC" : company?.name_en ?? "3DMCC";

  const isActive = (url: string | null) => {
    if (!url || url === "/") return pathname === `/${locale}` || pathname === "/";
    return pathname.startsWith(`/${locale}${url}`);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-charcoal-100 bg-white/90 backdrop-blur-lg shadow-soft"
          : "border-transparent bg-white"
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          {company?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logo_url} alt={name} className="h-9 w-auto" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-sm font-bold text-white">
              3D
            </span>
          )}
          <span className="text-lg font-bold tracking-tight text-charcoal-900 font-display">
            {name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.url ?? "/"}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.url)
                  ? "text-brand-600"
                  : "text-charcoal-700 hover:text-charcoal-900"
              )}
            >
              {localized(locale as "en" | "ar", { en: item.label_en, ar: item.label_ar })}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden lg:inline-flex" />
          <Link href="/contact" className="btn-primary hidden !px-4 !py-2 lg:inline-flex">
            <Phone className="h-4 w-4" />
            {t("contactUs")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-charcoal-800 transition-colors hover:bg-charcoal-50 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-charcoal-100 bg-white lg:hidden">
          <nav className="container-site flex flex-col gap-1 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.url ?? "/"}
                className={cn(
                  "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  isActive(item.url) ? "bg-brand-50 text-brand-700" : "text-charcoal-800 hover:bg-charcoal-50"
                )}
              >
                {localized(locale as "en" | "ar", { en: item.label_en, ar: item.label_ar })}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-charcoal-100 pt-4">
              <LanguageSwitcher />
              <Link href="/contact" className="btn-primary flex-1 !py-2.5">
                {t("contactUs")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
