import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getCourseBySlug,
  getCourses,
  getFormById,
  getFormFields,
  getFaqs,
} from "@/lib/data/public";
import { localized, absoluteUrl, formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { CourseCard } from "@/components/cards/course-card";
import { Clock, User, CalendarDays, GraduationCap, Check, ArrowRight } from "lucide-react";
import type { Json } from "@/types/database";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: localized(locale as "en" | "ar", {
      en: course.meta_title_en ?? course.title_en,
      ar: course.meta_title_ar ?? course.title_ar,
    }),
    description: localized(locale as "en" | "ar", {
      en: course.meta_description_en ?? course.short_description_en,
      ar: course.meta_description_ar ?? course.short_description_ar,
    }),
    alternates: { canonical: absoluteUrl(`/${locale}/courses/${course.slug}`) },
    openGraph: {
      title: localized(locale as "en" | "ar", { en: course.title_en, ar: course.title_ar }),
      description: localized(locale as "en" | "ar", { en: course.short_description_en, ar: course.short_description_ar }),
      url: absoluteUrl(`/${locale}/courses/${course.slug}`),
      siteName: "3DMCC",
      type: "website",
    },
  };
}

function list(value: Json | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
  return [];
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const [allCourses, form, fields, faqs] = await Promise.all([
    getCourses(),
    course.form_id ? getFormById(course.form_id) : null,
    course.form_id ? getFormFields(course.form_id) : [],
    getFaqs(),
  ]);

  const related = allCourses.filter((c) => c.id !== course.id).slice(0, 3);

  const objectives = list(locale === "ar" ? course.learning_objectives_ar : course.learning_objectives_en);
  const curriculum = list(locale === "ar" ? course.curriculum_ar : course.curriculum_en);
  const audience = list(locale === "ar" ? course.target_audience_ar : course.target_audience_en);
  const prereqs = list(locale === "ar" ? course.prerequisites_ar : course.prerequisites_en);

  const meta = [
    { icon: Clock, label: locale === "ar" ? "المدة" : "Duration", value: course.duration },
    { icon: GraduationCap, label: locale === "ar" ? "طريقة التقديم" : "Delivery", value: course.delivery_type },
    { icon: User, label: locale === "ar" ? "المدرّب" : "Instructor", value: localized(locale as "en" | "ar", { en: course.instructor_en, ar: course.instructor_ar }) },
    { icon: CalendarDays, label: locale === "ar" ? "تاريخ البدء" : "Start Date", value: course.start_date ? formatDate(course.start_date, locale as "en" | "ar") : null },
  ].filter((m) => m.value);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-charcoal-950 py-20">
        {course.featured_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.featured_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-brand-900/40" />
        <div className="container-site relative">
          <Breadcrumbs
            items={[
              { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
              { label: locale === "ar" ? "الدورات" : "Courses", href: "/courses" },
              { label: localized(locale as "en" | "ar", { en: course.title_en, ar: course.title_ar }) },
            ]}
          />
          <h1 className="mt-6 max-w-3xl text-3xl font-bold text-white sm:text-4xl font-display">
            {localized(locale as "en" | "ar", { en: course.title_en, ar: course.title_ar })}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-charcoal-300">
            {localized(locale as "en" | "ar", { en: course.short_description_en, ar: course.short_description_ar })}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {meta.map((m) => (
              <div key={m.label} className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-charcoal-200">
                <m.icon className="h-4 w-4 text-brand-400" />
                <span className="text-charcoal-400">{m.label}:</span>
                <span className="font-medium">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-base leading-relaxed text-charcoal-700">
              {localized(locale as "en" | "ar", { en: course.full_description_en, ar: course.full_description_ar })
                .split("\n\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}
            </div>

            {objectives.length > 0 && <ListBlock title={locale === "ar" ? "أهداف التعلم" : "Learning Objectives"} items={objectives} />}
            {curriculum.length > 0 && <ListBlock title={locale === "ar" ? "المنهاج" : "Curriculum"} items={curriculum} numbered />}
            {audience.length > 0 && <ListBlock title={locale === "ar" ? "الفئة المستهدفة" : "Target Audience"} items={audience} />}
            {prereqs.length > 0 && <ListBlock title={locale === "ar" ? "المتطلبات المسبقة" : "Prerequisites"} items={prereqs} />}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-charcoal-100 bg-charcoal-50 p-6">
              <h3 className="font-semibold text-charcoal-900">
                {locale === "ar" ? "سجّل الآن" : "Register Now"}
              </h3>
              {(() => {
                const hasOffer =
                  course.offer_price != null && course.price != null && course.offer_price < course.price;
                if (hasOffer) {
                  return (
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-brand-600">
                        {course.offer_price} {course.currency}
                      </span>
                      <span className="ms-2 text-sm text-charcoal-400 line-through">
                        {course.price} {course.currency}
                      </span>
                    </div>
                  );
                }
                return course.price != null ? (
                  <p className="mt-2 text-2xl font-bold text-brand-600">
                    {course.price} {course.currency}
                  </p>
                ) : null;
              })()}
              {course.availability && (
                <p className="mt-1 text-sm text-charcoal-600">
                  {["open", "full", "closed"].includes(course.availability)
                    ? locale === "ar"
                      ? { open: "متاح للتسجيل", full: "مكتمل", closed: "مغلق" }[course.availability as "open" | "full" | "closed"]
                      : { open: "Open for registration", full: "Full", closed: "Closed" }[course.availability as "open" | "full" | "closed"]
                    : course.availability}
                </p>
              )}
              <a href="#register" className="btn-primary mt-4 w-full">
                {locale === "ar" ? "سجّل في الدورة" : "Register for Course"}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section id="register" className="bg-charcoal-50 py-16">
        <div className="container-site">
          <div className="mx-auto max-w-2xl rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-semibold text-charcoal-900 font-display">
              {locale === "ar" ? "سجّل في الدورة" : "Register for Course"}
            </h2>
            {form && fields.length > 0 ? (
              <div className="mt-6">
                <DynamicForm
                  form={form}
                  fields={fields}
                  entityType="course"
                  entityId={course.id}
                  entityLabel={localized(locale as "en" | "ar", { en: course.title_en, ar: course.title_ar })}
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

      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-site">
            <h2 className="text-2xl font-semibold text-charcoal-900 font-display">
              {locale === "ar" ? "دورات ذات صلة" : "Related Courses"}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ListBlock({
  title,
  items,
  numbered = false,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
}) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-charcoal-900 font-display">{title}</h2>
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
