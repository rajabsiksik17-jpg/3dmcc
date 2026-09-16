import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { localized, formatDate } from "@/lib/utils";
import type { JobRow } from "@/types/database";
import { MapPin, Briefcase, CalendarDays, ArrowRight } from "lucide-react";

export function JobCard({ job }: { job: JobRow }) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("employmentTypes");

  return (
    <Link
      href={`/careers/${job.slug}`}
      className="group flex flex-col rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <h3 className="text-lg font-semibold text-charcoal-900 font-display">
        {localized(locale, { en: job.title_en, ar: job.title_ar })}
      </h3>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-charcoal-600">
        {job.department_en && (
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-brand-500" />
            {localized(locale, { en: job.department_en, ar: job.department_ar })}
          </span>
        )}
        {job.location_en && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-500" />
            {localized(locale, { en: job.location_en, ar: job.location_ar })}
          </span>
        )}
        {job.employment_type && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-brand-500" />
            {t(job.employment_type as "full_time" | "part_time" | "contract" | "internship" | "freelance")}
          </span>
        )}
      </div>
      {job.deadline && (
        <p className="mt-3 text-xs text-charcoal-500">
          {locale === "ar" ? "آخر موعد: " : "Deadline: "}
          {formatDate(job.deadline, locale)}
        </p>
      )}
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
        <span>{locale === "ar" ? "عرض الوظيفة" : "View Position"}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </span>
    </Link>
  );
}
