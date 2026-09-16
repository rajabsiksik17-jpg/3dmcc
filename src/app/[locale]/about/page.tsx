import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getSeoSettings } from "@/lib/data/public";
import { PageSections } from "@/components/page-sections";
import { localized, absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoSettings("about");
  return {
    title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
    description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
    alternates: { canonical: absoluteUrl(`/${locale}/about`) },
    openGraph: {
      title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
      description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
      url: absoluteUrl(`/${locale}/about`),
      siteName: "3DMCC",
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PageSections slug="about" />;
}
