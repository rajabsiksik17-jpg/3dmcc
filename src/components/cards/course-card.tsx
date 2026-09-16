import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { localized, formatDate } from "@/lib/utils";
import type { CourseRow } from "@/types/database";
import { Clock, User, CalendarDays } from "lucide-react";

export function CourseCard({ course }: { course: CourseRow }) {
  const locale = useLocale() as "en" | "ar";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
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
            <Clock className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-charcoal-900 font-display">
          {localized(locale, { en: course.title_en, ar: course.title_ar })}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-600">
          {localized(locale, { en: course.short_description_en, ar: course.short_description_ar })}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-charcoal-500">
          {course.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-500" />
              {course.duration}
            </span>
          )}
          {course.delivery_type && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-500" />
              {course.delivery_type}
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
