import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getJobBySlug, getFormById, getFormFields, getFaqs, getGlobalFaqs } from "@/lib/data/public";
import { localized, absoluteUrl, formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { MapPin, Briefcase, CalendarDays, Banknote, Check } from "lucide-react";
import type { Json } from "@/types/database";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};
  return {
    title: localized(locale as "en" | "ar", { en: job.title_en, ar: job.title_ar }),
    description: localized(locale as "en" | "ar", { en: job.description_en, ar: job.description_ar }),
    alternates: { canonical: absoluteUrl(`/${locale}/careers/${job.slug}`) },
  };
}

function list(value: Json | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
  return [];
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const [form, fields, jobFaqs, globalFaqs] = await Promise.all([
    job.form_id ? getFormById(job.form_id) : null,
    job.form_id ? getFormFields(job.form_id) : [],
    getFaqs({ jobId: job.id }),
    getGlobalFaqs(),
  ]);

  const faqs = jobFaqs.length > 0 ? jobFaqs : globalFaqs;

  const responsibilities = list(locale === "ar" ? job.responsibilities_ar : job.responsibilities_en);
  const requirements = list(locale === "ar" ? job.requirements_ar : job.requirements_en);
  const qualifications = list(locale === "ar" ? job.qualifications_ar : job.qualifications_en);
  const skills = list(locale === "ar" ? job.skills_ar : job.skills_en);
  const benefits = list(locale === "ar" ? job.benefits_ar : job.benefits_en);

  const title = localized(locale as "en" | "ar", { en: job.title_en, ar: job.title_ar });
  const salaryText =
    job.salary_min != null || job.salary_max != null
      ? `${job.salary_min ?? "?"} - ${job.salary_max ?? "?"} ${job.salary_currency ?? "JOD"}`
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description: localized(locale as "en" | "ar", { en: job.description_en, ar: job.description_ar }),
    datePosted: job.created_at.slice(0, 10),
    validThrough: job.deadline ?? undefined,
    employmentType: job.employment_type ?? undefined,
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: localized(locale as "en" | "ar", { en: job.location_en, ar: job.location_ar }) },
    },
    hiringOrganization: { "@type": "Organization", name: "3DMCC", sameAs: "https://3dmcc.net" },
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-charcoal-950 py-16">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
              { label: locale === "ar" ? "الوظائف" : "Careers", href: "/careers" },
              { label: title },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl font-display">{title}</h1>
          <div className="mt-6 flex flex-wrap gap-4">
            {job.department_en && (
              <Meta label={locale === "ar" ? "القسم" : "Department"} icon={Briefcase} value={localized(locale as "en" | "ar", { en: job.department_en, ar: job.department_ar })} />
            )}
            {job.location_en && (
              <Meta label={locale === "ar" ? "الموقع" : "Location"} icon={MapPin} value={localized(locale as "en" | "ar", { en: job.location_en, ar: job.location_ar })} />
            )}
            {job.deadline && (
              <Meta label={locale === "ar" ? "آخر موعد" : "Deadline"} icon={CalendarDays} value={formatDate(job.deadline, locale as "en" | "ar")} />
            )}
            {salaryText && (
              <Meta label={locale === "ar" ? "الراتب" : "Salary"} icon={Banknote} value={salaryText} />
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {job.description_en && (
              <p className="text-base leading-relaxed text-charcoal-700">
                {localized(locale as "en" | "ar", { en: job.description_en, ar: job.description_ar })}
              </p>
            )}
            {responsibilities.length > 0 && <ListBlock title={locale === "ar" ? "المسؤوليات" : "Responsibilities"} items={responsibilities} />}
            {requirements.length > 0 && <ListBlock title={locale === "ar" ? "المتطلبات" : "Requirements"} items={requirements} />}
            {qualifications.length > 0 && <ListBlock title={locale === "ar" ? "المؤهلات" : "Qualifications"} items={qualifications} />}
            {skills.length > 0 && <ListBlock title={locale === "ar" ? "المهارات" : "Skills"} items={skills} />}
            {benefits.length > 0 && <ListBlock title={locale === "ar" ? "المزايا" : "Benefits"} items={benefits} />}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-charcoal-100 bg-charcoal-50 p-6">
              <h3 className="font-semibold text-charcoal-900">
                {locale === "ar" ? "تقدّم لهذه الوظيفة" : "Apply for this position"}
              </h3>
              {job.experience && (
                <p className="mt-2 text-sm text-charcoal-600">
                  {locale === "ar" ? "الخبرة" : "Experience"}: {job.experience}
                </p>
              )}
              <a href="#apply" className="btn-primary mt-4 w-full">
                {locale === "ar" ? "قدّم الآن" : "Apply Now"}
              </a>
            </div>
          </aside>
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
                    <span className="text-brand-500">+</span>
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

      <section id="apply" className="bg-charcoal-50 py-16">
        <div className="container-site">
          <div className="mx-auto max-w-2xl rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-semibold text-charcoal-900 font-display">
              {locale === "ar" ? "قدّم لهذه الوظيفة" : "Apply for this position"}
            </h2>
            {form && fields.length > 0 ? (
              <div className="mt-6">
                <DynamicForm
                  form={form}
                  fields={fields}
                  entityType="career"
                  entityId={job.id}
                  entityLabel={title}
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
    </div>
  );
}

function Meta({ label, icon: Icon, value }: { label: string; icon: typeof MapPin; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-charcoal-200">
      <Icon className="h-4 w-4 text-brand-400" />
      <span className="text-charcoal-400">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-charcoal-900 font-display">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-charcoal-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
