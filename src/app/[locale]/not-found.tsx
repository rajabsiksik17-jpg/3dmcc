import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white p-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">404</p>
      <h1 className="mt-3 text-3xl font-bold text-charcoal-900 font-display">{t("title")}</h1>
      <p className="mt-3 max-w-md text-charcoal-600">{t("message")}</p>
      <Link href="/" className="btn-primary mt-6">
        {t("backHome")}
      </Link>
    </div>
  );
}
