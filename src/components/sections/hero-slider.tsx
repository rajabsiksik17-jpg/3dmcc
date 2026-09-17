"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Slide {
  badge_en?: string;
  badge_ar?: string;
  title_en?: string;
  title_ar?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  image?: string;
  primary_label_en?: string;
  primary_label_ar?: string;
  primary_url?: string;
  secondary_label_en?: string;
  secondary_label_ar?: string;
  secondary_url?: string;
  overlay?: number;
}

export function HeroSlider({ slides, autoplay = true, duration = 5000 }: { slides: Slide[]; autoplay?: boolean; duration?: number }) {
  const locale = useLocale() as "en" | "ar";
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = slides.length;

  function go(i: number) {
    setIndex(((i % count) + count) % count);
  }

  useEffect(() => {
    if (!autoplay || count <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), duration);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [autoplay, duration, count]);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null || count <= 1) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      if (locale === "ar") go(dx > 0 ? index - 1 : index + 1);
      else go(dx < 0 ? index + 1 : index - 1);
    }
    touchX.current = null;
  }

  const slide = slides[index] ?? slides[0];

  return (
    <section
      className="relative overflow-hidden bg-charcoal-950"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[540px] sm:h-[600px]">
        {slides.map((s, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            {s.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-charcoal-gradient" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-brand-900/30" style={{ opacity: s.overlay ?? 0.6 }} />
            <div className="absolute inset-0 bg-grid-dark opacity-30" />
          </div>
        ))}

        <div className="container-site relative flex h-full items-center">
          <div className="max-w-3xl">
            {slide?.badge_en && (
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
                {locale === "ar" ? slide.badge_ar : slide.badge_en}
              </span>
            )}
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl font-display">
              {locale === "ar" ? slide?.title_ar : slide?.title_en}
            </h1>
            {slide?.subtitle_en && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-300">
                {locale === "ar" ? slide.subtitle_ar : slide.subtitle_en}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {slide?.primary_label_en && (
                <Link href={slide.primary_url ?? "/services"} className="btn-primary">
                  {locale === "ar" ? slide.primary_label_ar : slide.primary_label_en}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              )}
              {slide?.secondary_label_en && (
                <Link href={slide.secondary_url ?? "/contact"} className="btn inline-flex border border-white/20 text-white hover:bg-white/10">
                  {locale === "ar" ? slide.secondary_label_ar : slide.secondary_label_en}
                </Link>
              )}
            </div>
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute start-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute end-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </button>
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  className={cn("h-2 rounded-full transition-all", i === index ? "w-8 bg-brand-500" : "w-2 bg-white/40 hover:bg-white/70")}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
