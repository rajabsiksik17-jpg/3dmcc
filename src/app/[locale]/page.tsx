import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPage, getPageSections, getSeoSettings } from "@/lib/data/public";
import { SectionRenderer } from "@/components/sections";
import { localized, absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoSettings("home");
  return {
    title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
    description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
    keywords: seo?.keywords?.split(",").map((k) => k.trim()) ?? [],
    alternates: { canonical: absoluteUrl(locale === "ar" ? "/ar" : "/en") },
    openGraph: {
      title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
      description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
      url: absoluteUrl(locale === "ar" ? "/ar" : "/en"),
      siteName: "3DMCC",
      locale: locale === "ar" ? "ar_JO" : "en_US",
      type: "website",
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getPage("home");
  const sections = page ? await getPageSections(page.id) : [];

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          type={section.type}
          content={section.content as Record<string, unknown>}
        />
      ))}
    </>
  );
}
