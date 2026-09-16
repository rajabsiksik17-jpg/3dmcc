import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageSections } from "@/components/page-sections";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الشروط والأحكام — 3DMCC" : "Terms & Conditions — 3DMCC",
    alternates: { canonical: absoluteUrl(`/${locale}/terms`) },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PageSections slug="terms" />;
}
