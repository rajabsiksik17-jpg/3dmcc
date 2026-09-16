import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageSections } from "@/components/page-sections";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "سياسة الخصوصية — 3DMCC" : "Privacy Policy — 3DMCC",
    alternates: { canonical: absoluteUrl(`/${locale}/privacy-policy`) },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PageSections slug="privacy-policy" />;
}
