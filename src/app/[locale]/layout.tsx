import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { Plus_Jakarta_Sans, Inter, Tajawal } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/layout/floating-contact";
import { CookieConsent } from "@/components/layout/cookie-consent";
import {
  getCompanySettings,
  getMenuItems,
  getServices,
  getCourses,
} from "@/lib/data/public";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const company = await getCompanySettings();
  return {
    icons: company?.favicon_url ? { icon: company.favicon_url } : undefined,
    title: {
      default: locale === "ar" ? company?.name_ar ?? "3DMCC" : company?.name_en ?? "3DMCC",
      template: `%s — ${company?.name_en ?? "3DMCC"}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";
  const messages = locale === "ar"
    ? (await import("../../../messages/ar.json")).default
    : (await import("../../../messages/en.json")).default;

  const [company, headerMenu, footerMenu, services, courses] = await Promise.all([
    getCompanySettings(),
    getMenuItems("header"),
    getMenuItems("footer"),
    getServices({ limit: 6 }),
    getCourses({ limit: 5 }),
  ]);

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${jakarta.variable} ${tajawal.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header company={company} menuItems={headerMenu} />
          <main className="min-h-screen">{children}</main>
          <Footer
            company={company}
            footerMenu={footerMenu}
            services={services}
            courses={courses}
          />
          <FloatingContact company={company} />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
