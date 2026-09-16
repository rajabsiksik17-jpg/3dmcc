import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  getSeoSettings,
  getServices,
  getServiceCategories,
} from "@/lib/data/public";
import { PageSections } from "@/components/page-sections";
import { ServicesExplorer } from "@/components/explorers/services-explorer";
import { localized, absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoSettings("services");
  return {
    title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
    description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
    alternates: { canonical: absoluteUrl(`/${locale}/services`) },
    openGraph: {
      title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
      description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
      url: absoluteUrl(`/${locale}/services`),
      siteName: "3DMCC",
      type: "website",
    },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [services, categories] = await Promise.all([
    getServices(),
    getServiceCategories(),
  ]);

  return (
    <>
      <PageSections slug="services" />
      <section className="bg-white py-16">
        <div className="container-site">
          <ServicesExplorer services={services} categories={categories} />
        </div>
      </section>
    </>
  );
}
