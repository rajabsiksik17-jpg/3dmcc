"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

export interface StatItem {
  value: number;
  label_en: string;
  label_ar: string;
  suffix?: string;
}

export function StatsCounter({ items }: { items: StatItem[] }) {
  const locale = useLocale() as "en" | "ar";
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {items.map((item, i) => (
        <div key={i} className="text-center">
          <CountUp value={item.value} started={started} suffix={item.suffix ?? ""} />
          <p className="mt-2 text-sm text-white/90">{locale === "ar" ? item.label_ar : item.label_en}</p>
        </div>
      ))}
    </div>
  );
}

function CountUp({ value, started, suffix }: { value: number; started: boolean; suffix: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (value <= 0) {
      setDisplay(value);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);

  return (
    <div className="text-4xl font-bold text-white font-display" dir="ltr">
      {display.toLocaleString()}
      {suffix}
    </div>
  );
}
