import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { Inter, Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import "../globals.css";
import adminEn from "../../../messages/admin.en.json";
import adminAr from "../../../messages/admin.ar.json";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-arabic", display: "swap" });

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("admin_locale")?.value === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const messages = locale === "ar" ? adminAr : adminEn;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${jakarta.variable} ${tajawal.variable}`}
    >
      <body className="bg-charcoal-50">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
