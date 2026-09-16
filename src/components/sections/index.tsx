import { useLocale, useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { cn, localized } from "@/lib/utils";
import { DynamicIcon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/routing";
import { ServiceCard } from "@/components/cards/service-card";
import { CourseCard } from "@/components/cards/course-card";
import { TeamCard } from "@/components/cards/team-card";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import {
  getServices,
  getCourses,
  getTeamMembers,
  getTestimonials,
  getClients,
  getPartners,
  getFaqs,
  getCompanySettings,
  getFormBySlug,
  getFormFields,
} from "@/lib/data/public";
import { ContactBlock } from "./contact-block";
import { ArrowRight, Mail, MapPin, Phone, Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type Data = Record<string, unknown>;
const str = (d: Data, k: string, fallback = "") => (typeof d[k] === "string" ? (d[k] as string) : fallback);
const arr = (d: Data, k: string): Data[] => (Array.isArray(d[k]) ? (d[k] as Data[]) : []);
const num = (d: Data, k: string): number | undefined =>
  typeof d[k] === "number" ? (d[k] as number) : undefined;

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  align?: "center" | "start";
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-start")}>
      {eyebrow && (
        <span className={cn("eyebrow", align === "center" && "justify-center")}>{eyebrow}</span>
      )}
      {title && (
        <h2 className={cn("section-title", dark && "text-white")}>{title}</h2>
      )}
      {subtitle && (
        <p className={cn("section-subtitle", align === "center" && "mx-auto", dark && "text-charcoal-300")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("py-20 sm:py-24", className)}>{children}</section>;
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function HeroSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("common");

  return (
    <section className="relative overflow-hidden bg-charcoal-950 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute right-[15%] top-[20%] hidden h-16 w-16 rotate-45 rounded-2xl bg-brand-500/30 lg:block" />
      <div className="absolute left-[12%] bottom-[25%] hidden h-10 w-10 rounded-full border border-brand-500/40 lg:block" />

      <div className="container-site relative">
        <div className="max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
              {str(content, "badge_en") && locale === "en"
                ? str(content, "badge_en")
                : str(content, "badge_ar")}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl font-display">
              {locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-300">
              {locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={str(content, "primary_url", "/services")} className="btn-primary">
                {locale === "ar" ? str(content, "primary_label_ar") : str(content, "primary_label_en")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              {str(content, "secondary_label_en") && (
                <Link
                  href={str(content, "secondary_url", "/contact")}
                  className="btn inline-flex border border-white/20 text-white hover:bg-white/10"
                >
                  {locale === "ar" ? str(content, "secondary_label_ar") : str(content, "secondary_label_en")}
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Rich text
// ---------------------------------------------------------------------------
function RichTextSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  return (
    <Section className="bg-white">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
              title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-700">
              {(locale === "ar" ? str(content, "content_ar") : str(content, "content_en"))
                .split("\n\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Image + text
// ---------------------------------------------------------------------------
function ImageTextSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  const image = str(content, "image");
  const position = str(content, "image_position", "right");
  const bullets = locale === "ar" ? arr(content, "bullets_ar") : arr(content, "bullets_en");

  return (
    <Section className="bg-white">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <Reveal className={cn(position === "right" ? "lg:order-1" : "lg:order-2")}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="w-full rounded-2xl object-cover shadow-lift" />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-charcoal-gradient">
              <div className="text-center">
                <DynamicIcon name="Layers" className="mx-auto h-16 w-16 text-brand-400" />
                <p className="mt-4 text-lg font-semibold text-white">3DMCC</p>
                <p className="text-sm text-charcoal-300">3D for Management Consulting Company</p>
              </div>
            </div>
          )}
        </Reveal>
        <Reveal className={cn(position === "right" ? "lg:order-2" : "lg:order-1")}>
          <SectionHeading
            align="start"
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
          />
          <p className="mt-4 text-base leading-relaxed text-charcoal-700">
            {locale === "ar" ? str(content, "text_ar") : str(content, "text_en")}
          </p>
          {bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-charcoal-700">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  </span>
                  {String(b)}
                </li>
              ))}
            </ul>
          )}
          {str(content, "primary_label_en") && (
            <Link href={str(content, "primary_url", "/about")} className="btn-primary mt-8">
              {locale === "ar" ? str(content, "primary_label_ar") : str(content, "primary_label_en")}
            </Link>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Services grid
// ---------------------------------------------------------------------------
async function ServicesGridSection({ content }: { content: Data }) {
  const locale = (await getLocale()) as "en" | "ar";
  const limit = num(content, "limit") ?? 6;
  const services = await getServices({ limit });

  if (services.length === 0) return null;

  return (
    <Section className="bg-charcoal-50">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            subtitle={locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href={str(content, "show_all_url", "/services")} className="btn-secondary">
            {locale === "ar" ? "عرض الكل" : "View All Services"}
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Courses grid
// ---------------------------------------------------------------------------
async function CoursesGridSection({ content }: { content: Data }) {
  const locale = (await getLocale()) as "en" | "ar";
  const limit = num(content, "limit") ?? 4;
  const courses = await getCourses({ limit });

  if (courses.length === 0) return null;

  return (
    <Section className="bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            subtitle={locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <CourseCard course={c} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href={str(content, "show_all_url", "/courses")} className="btn-secondary">
            {locale === "ar" ? "عرض الكل" : "View All Courses"}
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Features (icon cards)
// ---------------------------------------------------------------------------
function FeaturesSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  const items = arr(content, "items");

  return (
    <Section className="bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            subtitle={locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <DynamicIcon name={str(item, "icon")} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-charcoal-900">
                  {locale === "ar" ? str(item, "title_ar") : str(item, "title_en")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                  {locale === "ar" ? str(item, "text_ar") : str(item, "text_en")}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Approach
// ---------------------------------------------------------------------------
function ApproachSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  const items = arr(content, "items");

  return (
    <Section className="bg-charcoal-950">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            dark
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            subtitle={locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="absolute top-5 end-5 text-3xl font-bold text-brand-500/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
                  <DynamicIcon name={str(item, "icon")} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {locale === "ar" ? str(item, "title_ar") : str(item, "title_en")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-300">
                  {locale === "ar" ? str(item, "text_ar") : str(item, "text_en")}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Vision & mission
// ---------------------------------------------------------------------------
function VisionMissionSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  return (
    <Section className="bg-charcoal-50">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl bg-white p-8 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <DynamicIcon name="Target" className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal-900">
                {locale === "ar" ? "رؤيتنا" : "Our Vision"}
              </h3>
              <p className="mt-2 leading-relaxed text-charcoal-700">
                {locale === "ar" ? str(content, "vision_ar") : str(content, "vision_en")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl bg-white p-8 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <DynamicIcon name="Compass" className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal-900">
                {locale === "ar" ? "رسالتنا" : "Our Mission"}
              </h3>
              <p className="mt-2 leading-relaxed text-charcoal-700">
                {locale === "ar" ? str(content, "mission_ar") : str(content, "mission_en")}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Core values
// ---------------------------------------------------------------------------
function CoreValuesSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  const items = arr(content, "items");
  return (
    <Section className="bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-charcoal-100 bg-charcoal-50 p-6 text-center transition-all hover:bg-white hover:shadow-lift">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <DynamicIcon name={str(item, "icon")} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-charcoal-900">
                  {locale === "ar" ? str(item, "title_ar") : str(item, "title_en")}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-charcoal-600">
                  {locale === "ar" ? str(item, "text_ar") : str(item, "text_en")}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------
function TimelineSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  const items = arr(content, "items");
  return (
    <Section className="bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="relative h-full rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
                <div className="text-3xl font-bold text-brand-500">{str(item, "year")}</div>
                <h3 className="mt-2 font-semibold text-charcoal-900">
                  {locale === "ar" ? str(item, "title_ar") : str(item, "title_en")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                  {locale === "ar" ? str(item, "text_ar") : str(item, "text_en")}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
function StatsSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  const items = arr(content, "items");
  if (items.length === 0) return null;
  return (
    <Section className="bg-brand-gradient">
      <div className="container-site">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{String(item.value)}</div>
                <p className="mt-2 text-sm text-white/90">
                  {locale === "ar" ? str(item, "label_ar") : str(item, "label_en")}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------
async function TeamSection({ content }: { content: Data }) {
  const locale = (await getLocale()) as "en" | "ar";
  const members = await getTeamMembers();
  if (members.length === 0) return null;
  return (
    <Section className="bg-charcoal-50">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            subtitle={locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.05}>
              <TeamCard member={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
async function TestimonialsSection({ content }: { content: Data }) {
  const locale = (await getLocale()) as "en" | "ar";
  const items = await getTestimonials();
  if (items.length === 0) return null;
  return (
    <Section className="bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            subtitle={locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.05}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Clients / Partners / logo cloud
// ---------------------------------------------------------------------------
async function LogoCloudSection({ content, kind }: { content: Data; kind: "clients" | "partners" }) {
  const locale = (await getLocale()) as "en" | "ar";
  const items = kind === "clients" ? await getClients() : await getPartners();
  if (items.length === 0) return null;
  return (
    <Section className="bg-white py-16">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.03}>
              <div className="flex h-20 items-center justify-center rounded-xl border border-charcoal-100 bg-white p-4">
                {item.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-sm font-semibold text-charcoal-500">{item.name}</span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
async function FaqSection({ content }: { content: Data }) {
  const locale = (await getLocale()) as "en" | "ar";
  const faqs = await getFaqs();
  if (faqs.length === 0) return null;
  return (
    <Section className="bg-charcoal-50">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            subtitle={locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-charcoal-100 rounded-2xl border border-charcoal-100 bg-white shadow-card">
          {faqs.map((f) => (
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
    </Section>
  );
}

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------
function CtaSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  return (
    <Section className="bg-white py-16">
      <div className="container-site">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-charcoal-gradient px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 bg-grid-dark opacity-30" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl font-display">
                {locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-charcoal-300">
                {locale === "ar" ? str(content, "text_ar") : str(content, "text_en")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href={str(content, "primary_url", "/contact")} className="btn-primary">
                  {locale === "ar" ? str(content, "primary_label_ar") : str(content, "primary_label_en")}
                </Link>
                {str(content, "secondary_label_en") && (
                  <Link
                    href={str(content, "secondary_url", "/services")}
                    className="btn inline-flex border border-white/20 text-white hover:bg-white/10"
                  >
                    {locale === "ar" ? str(content, "secondary_label_ar") : str(content, "secondary_label_en")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
function ContactSection({ content }: { content: Data }) {
  const locale = useLocale() as "en" | "ar";
  return (
    <Section className="bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            eyebrow={locale === "ar" ? str(content, "eyebrow_ar") : str(content, "eyebrow_en")}
            title={locale === "ar" ? str(content, "title_ar") : str(content, "title_en")}
            subtitle={locale === "ar" ? str(content, "subtitle_ar") : str(content, "subtitle_en")}
          />
        </Reveal>
        <div className="mt-12">
          <ContactBlock />
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Spacer / divider
// ---------------------------------------------------------------------------
function SpacerSection({ content }: { content: Data }) {
  const size = num(content, "size") ?? 48;
  return <div style={{ height: size }} />;
}

function DividerSection() {
  return (
    <div className="container-site">
      <div className="h-px bg-charcoal-100" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------
const MAP: Record<string, (props: { content: Data }) => Promise<ReactNode> | ReactNode> = {
  hero: HeroSection,
  rich_text: RichTextSection,
  image_text: ImageTextSection,
  services_grid: ServicesGridSection,
  courses_grid: CoursesGridSection,
  features: FeaturesSection,
  approach: ApproachSection,
  vision_mission: VisionMissionSection,
  core_values: CoreValuesSection,
  timeline: TimelineSection,
  stats: StatsSection,
  team: TeamSection,
  testimonials: TestimonialsSection,
  clients: (p) => LogoCloudSection({ ...p, kind: "clients" }),
  partners: (p) => LogoCloudSection({ ...p, kind: "partners" }),
  faq: FaqSection,
  cta: CtaSection,
  contact: ContactSection,
  spacer: SpacerSection,
  divider: DividerSection,
};

export function SectionRenderer({
  type,
  content,
}: {
  type: string;
  content: Record<string, unknown>;
}) {
  const Component = MAP[type];
  if (!Component) return null;
  return <Component content={content} />;
}
