import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getSeoSettings } from "@/lib/data/public";
import { PageSections } from "@/components/page-sections";
import { ContactBlock } from "@/components/sections/contact-block";
import { localized, absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoSettings("contact");
  return {
    title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
    description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
    alternates: { canonical: absoluteUrl(`/${locale}/contact`) },
    openGraph: {
      title: localized(locale as "en" | "ar", { en: seo?.title_en, ar: seo?.title_ar }),
      description: localized(locale as "en" | "ar", { en: seo?.description_en, ar: seo?.description_ar }),
      url: absoluteUrl(`/${locale}/contact`),
      siteName: "3DMCC",
      type: "website",
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageSections slug="contact" />
      <section className="bg-white py-16">
        <div className="container-site">
          <ContactBlock />
        </div>
      </section>
    </>
  );
}
