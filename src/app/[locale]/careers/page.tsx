import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getSeoSettings, getJobs } from "@/lib/data/public";
import { PageSections } from "@/components/page-sections";
import { CareersExplorer } from "@/components/explorers/careers-explorer";
import { localized, absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoSettings("careers");
  return {
    title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
    description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
    alternates: { canonical: absoluteUrl(`/${locale}/careers`) },
    openGraph: {
      title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
      description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
      url: absoluteUrl(`/${locale}/careers`),
      siteName: "3DMCC",
      type: "website",
    },
  };
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jobs = await getJobs();

  return (
    <>
      <PageSections slug="careers" />
      <section className="bg-white py-16">
        <div className="container-site">
          <CareersExplorer jobs={jobs} />
        </div>
      </section>
    </>
  );
}
