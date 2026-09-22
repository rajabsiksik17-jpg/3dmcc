"use client";

import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export interface LogoItem {
  id: string;
  name: string;
  logo?: string | null;
  website?: string | null;
}

export function LogoMarquee({ logos }: { logos: LogoItem[] }) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  if (logos.length === 0) return null;

  const items = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden py-2" dir={dir}>
      <div
        className={cn("flex w-max items-center gap-6", dir === "rtl" ? "animate-marquee-rtl" : "animate-marquee-ltr")}
      >
        {items.map((l, i) => (
          <div
            key={`${l.id}-${i}`}
            className="group flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-charcoal-100 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
          >
            {l.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.logo}
                alt={l.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            ) : (
              <span className="text-sm font-semibold text-charcoal-500">{l.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
