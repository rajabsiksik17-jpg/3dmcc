"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "3dmcc-cookie-consent";

export function CookieConsent() {
  const locale = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setShow(true);
  }, []);

  function choose(value: "all" | "essential") {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent("3dmcc-consent", { detail: value }));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-2xl">
      <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-lift">
        <h3 className="text-sm font-semibold text-charcoal-900">
          {locale === "ar" ? "نحن نهتم بخصوصيتك" : "We value your privacy"}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-charcoal-600">
          {locale === "ar"
            ? "نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل حركة المرور."
            : "We use cookies to enhance your browsing experience and analyze site traffic."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => choose("all")}>
            {locale === "ar" ? "قبول الكل" : "Accept All"}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => choose("essential")}>
            {locale === "ar" ? "الأساسية فقط" : "Essential Only"}
          </Button>
        </div>
      </div>
    </div>
  );
}
