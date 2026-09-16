import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getSeoSettings, getCourses, getCourseCategories } from "@/lib/data/public";
import { PageSections } from "@/components/page-sections";
import { CoursesExplorer } from "@/components/explorers/courses-explorer";
import { localized, absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoSettings("courses");
  return {
    title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
    description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
    alternates: { canonical: absoluteUrl(`/${locale}/courses`) },
    openGraph: {
      title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
      description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
      url: absoluteUrl(`/${locale}/courses`),
      siteName: "3DMCC",
      type: "website",
    },
  };
}

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [courses, categories] = await Promise.all([getCourses(), getCourseCategories()]);

  return (
    <>
      <PageSections slug="courses" />
      <section className="bg-white py-16">
        <div className="container-site">
          <CoursesExplorer courses={courses} categories={categories} />
        </div>
      </section>
    </>
  );
}
