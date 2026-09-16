import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CheckCircle2 } from "lucide-react";

export default async function ThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white p-6 text-center">
      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      <h1 className="mt-6 text-3xl font-bold text-charcoal-900 font-display">
        <ThankYouTitle />
      </h1>
      <p className="mt-3 max-w-md text-charcoal-600">
        <ThankYouMessage />
      </p>
      <Link href="/" className="btn-primary mt-8">
        <HomeLabel />
      </Link>
    </div>
  );
}

function ThankYouTitle() {
  const t = useTranslations("forms");
  return <>{t("successTitle")}</>;
}

function ThankYouMessage() {
  const t = useTranslations("forms");
  return <>{t("successMessage")}</>;
}

function HomeLabel() {
  const t = useTranslations("common");
  return <>{t("backToHome")}</>;
}
