import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { localized, formatDate } from "@/lib/utils";
import type { CourseRow } from "@/types/database";
import { Clock, User, CalendarDays, BadgePercent } from "lucide-react";
import { DynamicIcon } from "@/components/ui/icon";

export function CourseCard({ course }: { course: CourseRow }) {
  const locale = useLocale() as "en" | "ar";
  const ta = useTranslations("availability");
  const td = useTranslations("delivery");

  const hasOffer = course.offer_price != null && course.price != null && course.offer_price < course.price;
  const percent = hasOffer && course.price ? Math.round(((course.price - (course.offer_price ?? 0)) / course.price) * 100) : 0;

  const availability = course.availability
    ? ta.has(course.availability)
      ? ta(course.availability as "open" | "full" | "closed")
      : course.availability
    : "";

  const duration = localized(locale, { en: course.duration, ar: course.duration_ar });
  const delivery = course.delivery_type
    ? td.has(course.delivery_type)
      ? td(course.delivery_type as "in_person" | "online" | "hybrid")
      : course.delivery_type
    : "";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
        hasOffer ? "border-brand-200 ring-1 ring-brand-100" : "border-charcoal-100"
      }`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal-100">
        {course.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.featured_image}
            alt={localized(locale, { en: course.title_en, ar: course.title_ar })}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal-100 to-charcoal-200 text-charcoal-400">
            <DynamicIcon name={course.icon ?? "GraduationCap"} className="h-8 w-8" />
          </div>
        )}
        {hasOffer && (
          <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white shadow-soft">
            <BadgePercent className="h-3.5 w-3.5" />
            {percent}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-charcoal-900 font-display">
          {localized(locale, { en: course.title_en, ar: course.title_ar })}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-600">
          {localized(locale, { en: course.short_description_en, ar: course.short_description_ar })}
        </p>

        <div className="mt-4 flex items-center gap-2">
          {hasOffer ? (
            <>
              <span className="text-lg font-bold text-brand-600">
                {course.offer_price} {course.currency}
              </span>
              <span className="text-sm text-charcoal-400 line-through">
                {course.price} {course.currency}
              </span>
            </>
          ) : course.price != null ? (
            <span className="text-lg font-bold text-charcoal-900">
              {course.price} {course.currency}
            </span>
          ) : null}
          {availability && <span className="ms-auto text-xs text-charcoal-500">{availability}</span>}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-charcoal-500">
          {duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-500" />
              {duration}
            </span>
          )}
          {delivery && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-500" />
              {delivery}
            </span>
          )}
          {course.start_date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-brand-500" />
              {formatDate(course.start_date, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
