import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { localized } from "@/lib/utils";
import type {
  CompanySettingsRow,
  MenuItemRow,
  ServiceRow,
  CourseRow,
} from "@/types/database";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  MessageCircle,
} from "lucide-react";

export function Footer({
  company,
  footerMenu,
  services,
  courses,
}: {
  company: CompanySettingsRow | null;
  footerMenu: MenuItemRow[];
  services: ServiceRow[];
  courses: CourseRow[];
}) {
  const t = useTranslations("common");
  const locale = useLocale() as "en" | "ar";
  const year = new Date().getFullYear();
  const name = localized(locale, { en: company?.name_en, ar: company?.name_ar }) || "3DMCC";

  const socials = [
    { url: company?.facebook, icon: Facebook, label: "Facebook" },
    { url: company?.instagram, icon: Instagram, label: "Instagram" },
    { url: company?.linkedin, icon: Linkedin, label: "LinkedIn" },
    { url: company?.youtube, icon: Youtube, label: "YouTube" },
    { url: company?.twitter, icon: Twitter, label: "X" },
    { url: company?.whatsapp ? `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, "")}` : null, icon: MessageCircle, label: "WhatsApp" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-charcoal-100 bg-charcoal-950 text-charcoal-300">
      <div className="container-site grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            {company?.logo_light_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_light_url} alt={name} className="h-9 w-auto" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-sm font-bold text-white">
                3D
              </span>
            )}
            <span className="text-lg font-bold text-white font-display">{name}</span>
          </div>
          <p className="text-sm leading-relaxed">
            {localized(locale, {
              en: company?.short_description_en,
              ar: company?.short_description_ar,
            })}
          </p>
          {socials.length > 0 && (
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-charcoal-300 transition-colors hover:bg-brand-500 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            {t("quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {footerMenu.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url ?? "/"}
                  className="text-sm transition-colors hover:text-brand-400"
                >
                  {localized(locale, { en: item.label_en, ar: item.label_ar })}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            {t("ourServices")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm transition-colors hover:text-brand-400"
                >
                  {localized(locale, { en: s.title_en, ar: s.title_ar })}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="text-sm font-medium text-brand-400 hover:text-brand-300">
                {t("viewAll")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            {t("getInTouch")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {company?.phone && (
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} dir="ltr" className="hover:text-brand-400">
                  {company.phone}
                </a>
              </li>
            )}
            {company?.email && (
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${company.email}`} className="hover:text-brand-400">
                  {company.email}
                </a>
              </li>
            )}
            {(company?.address_en || company?.address_ar) && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>
                  {localized(locale, { en: company?.address_en, ar: company?.address_ar })}
                </span>
              </li>
            )}
            {(company?.working_hours_en || company?.working_hours_ar) && (
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>
                  {localized(locale, { en: company?.working_hours_en, ar: company?.working_hours_ar })}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-charcoal-400 sm:flex-row">
          <p>
            © {year} {name}. {t("allRightsReserved")}.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-brand-400">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-brand-400">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
