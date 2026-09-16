import { useLocale } from "next-intl";
import { localized } from "@/lib/utils";
import type { TestimonialRow } from "@/types/database";
import { Star } from "lucide-react";

export function TestimonialCard({ testimonial }: { testimonial: TestimonialRow }) {
  const locale = useLocale() as "en" | "ar";
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
      {testimonial.rating && (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < testimonial.rating! ? "fill-brand-500 text-brand-500" : "text-charcoal-200"
              }`}
            />
          ))}
        </div>
      )}
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-700">
        &ldquo;{localized(locale, { en: testimonial.content_en, ar: testimonial.content_ar })}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
          {testimonial.client_name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal-900">{testimonial.client_name}</p>
          {(testimonial.position || testimonial.company) && (
            <p className="text-xs text-charcoal-500">
              {[testimonial.position, testimonial.company].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
