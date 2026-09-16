import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { localized } from "@/lib/utils";
import type { ServiceRow } from "@/types/database";
import { DynamicIcon } from "@/components/ui/icon";
import { ArrowRight } from "lucide-react";

export function ServiceCard({ service }: { service: ServiceRow }) {
  const locale = useLocale() as "en" | "ar";
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        <DynamicIcon name={service.icon} className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-charcoal-900 font-display">
        {localized(locale, { en: service.title_en, ar: service.title_ar })}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-600">
        {localized(locale, { en: service.short_description_en, ar: service.short_description_ar })}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
        <span>{locale === "ar" ? "اعرف المزيد" : "Learn More"}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </span>
    </Link>
  );
}
