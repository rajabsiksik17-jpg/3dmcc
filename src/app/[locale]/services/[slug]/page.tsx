import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getServiceBySlug,
  getServices,
  getFormById,
  getFormFields,
  getFaqs,
} from "@/lib/data/public";
import { localized, absoluteUrl } from "@/lib/utils";
import { useLocale } from "next-intl";
import { DynamicIcon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { ServiceCard } from "@/components/cards/service-card";
import { Check, ArrowRight } from "lucide-react";
import type { Json } from "@/types/database";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: localized(locale as "en" | "ar", {
      en: service.meta_title_en ?? service.title_en,
      ar: service.meta_title_ar ?? service.title_ar,
    }),
    description: localized(locale as "en" | "ar", {
      en: service.meta_description_en ?? service.short_description_en,
      ar: service.meta_description_ar ?? service.short_description_ar,
    }),
    alternates: { canonical: absoluteUrl(`/${locale}/services/${service.slug}`) },
    openGraph: {
      title: localized(locale as "en" | "ar", { en: service.title_en, ar: service.title_ar }),
      description: localized(locale as "en" | "ar", { en: service.short_description_en, ar: service.short_description_ar }),
      url: absoluteUrl(`/${locale}/services/${service.slug}`),
      siteName: "3DMCC",
      type: "website",
    },
  };
}

function list(value: Json | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === "string" ? v : String(v))).filter(Boolean);
  }
  return [];
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [allServices, form, fields, faqs] = await Promise.all([
    getServices(),
    service.form_id ? getFormById(service.form_id) : null,
    service.form_id ? getFormFields(service.form_id) : [],
    getFaqs(),
  ]);

  const related = allServices.filter((s) => s.id !== service.id).slice(0, 3);

  const benefits = list(locale === "ar" ? service.benefits_ar : service.benefits_en);
  const offer = list(locale === "ar" ? service.what_we_offer_ar : service.what_we_offer_en);
  const whoFor = list(locale === "ar" ? service.who_for_ar : service.who_for_en);
  const process = list(locale === "ar" ? service.process_ar : service.process_en);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 py-20">
        {service.background_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.background_image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-brand-900/40" />
        <div className="container-site relative">
          <Breadcrumbs
            items={[
              { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
              { label: locale === "ar" ? "خدماتنا" : "Services", href: "/services" },
              { label: localized(locale as "en" | "ar", { en: service.title_en, ar: service.title_ar }) },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300">
              <DynamicIcon name={service.icon} className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl font-display">
              {localized(locale as "en" | "ar", { en: service.title_en, ar: service.title_ar })}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-charcoal-300">
              {localized(locale as "en" | "ar", {
                en: service.short_description_en,
                ar: service.short_description_ar,
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="prose max-w-none text-base leading-relaxed text-charcoal-700">
              {localized(locale as "en" | "ar", {
                en: service.full_description_en,
                ar: service.full_description_ar,
              })
                .split("\n\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i} className="mb-4">
                    {p}
                  </p>
                ))}
            </div>

            {benefits.length > 0 && (
              <ListBlock
                icon="Target"
                title={locale === "ar" ? "المزايا" : "Benefits"}
                items={benefits}
              />
            )}
            {offer.length > 0 && (
              <ListBlock
                icon="Layers"
                title={locale === "ar" ? "ماذا نقدم" : "What We Offer"}
                items={offer}
              />
            )}
            {whoFor.length > 0 && (
              <ListBlock
                icon="Users"
                title={locale === "ar" ? "لمن هذه الخدمة" : "Who This Service Is For"}
                items={whoFor}
              />
            )}
            {process.length > 0 && (
              <ListBlock
                icon="Workflow"
                title={locale === "ar" ? "منهجية العمل" : "Our Process"}
                items={process}
                numbered
              />
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-charcoal-100 bg-charcoal-50 p-6">
              <h3 className="font-semibold text-charcoal-900">
                {locale === "ar" ? "هل تحتاج إلى هذه الخدمة؟" : "Need this service?"}
              </h3>
              <p className="mt-2 text-sm text-charcoal-600">
                {locale === "ar"
                  ? "تواصل معنا لمناقشة متطلباتك والحصول على عرض مخصص."
                  : "Get in touch to discuss your requirements and receive a tailored proposal."}
              </p>
              <a href="#request" className="btn-primary mt-4 w-full">
                {localized(locale as "en" | "ar", {
                  en: service.cta_text_en ?? "Request This Service",
                  ar: service.cta_text_ar ?? "اطلب هذه الخدمة",
                })}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Request form */}
      <section id="request" className="bg-charcoal-50 py-16">
        <div className="container-site">
          <div className="mx-auto max-w-2xl rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-semibold text-charcoal-900 font-display">
              {localized(locale as "en" | "ar", {
                en: service.cta_text_en ?? "Request This Service",
                ar: service.cta_text_ar ?? "اطلب هذه الخدمة",
              })}
            </h2>
            {form && fields.length > 0 ? (
              <div className="mt-6">
                <DynamicForm
                  form={form}
                  fields={fields}
                  entityType="service"
                  entityId={service.id}
                  entityLabel={localized(locale as "en" | "ar", { en: service.title_en, ar: service.title_ar })}
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-charcoal-500">
                {locale === "ar" ? "يرجى التواصل معنا مباشرة." : "Please contact us directly."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16">
          <div className="container-site">
            <h2 className="text-2xl font-semibold text-charcoal-900 font-display">
              {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            <div className="mt-6 divide-y divide-charcoal-100 rounded-2xl border border-charcoal-100 bg-white shadow-card">
              {faqs.slice(0, 4).map((f) => (
                <details key={f.id} className="group px-6 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-charcoal-900">
                    {locale === "ar" ? f.question_ar : f.question_en}
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-500 transition-transform group-open:rotate-90 rtl:rotate-180 rtl:group-open:-rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                    {locale === "ar" ? f.answer_ar : f.answer_en}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-site">
            <h2 className="text-2xl font-semibold text-charcoal-900 font-display">
              {locale === "ar" ? "خدمات ذات صلة" : "Related Services"}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ListBlock({
  icon,
  title,
  items,
  numbered = false,
}: {
  icon: string;
  title: string;
  items: string[];
  numbered?: boolean;
}) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <DynamicIcon name={icon} className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold text-charcoal-900 font-display">{title}</h2>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl bg-charcoal-50 px-4 py-3 text-sm text-charcoal-700">
            {numbered ? (
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                {i + 1}
              </span>
            ) : (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
