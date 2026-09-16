import { getLocale, getTranslations } from "next-intl/server";
import { localized } from "@/lib/utils";
import { getCompanySettings, getFormBySlug, getFormFields } from "@/lib/data/public";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export async function ContactBlock() {
  const locale = (await getLocale()) as "en" | "ar";
  const t = await getTranslations("contact");
  const c = await getTranslations("common");
  const company = await getCompanySettings();
  const form = await getFormBySlug("contact-form");
  const fields = form ? await getFormFields(form.id) : [];

  const info = [
    { icon: Phone, label: t("phone"), value: company?.phone, href: company?.phone ? `tel:${company.phone.replace(/\s/g, "")}` : undefined },
    { icon: Mail, label: t("email"), value: company?.email, href: company?.email ? `mailto:${company.email}` : undefined },
    { icon: MapPin, label: c("address"), value: localized(locale, { en: company?.address_en, ar: company?.address_ar }) },
    { icon: Clock, label: c("workingHours"), value: localized(locale, { en: company?.working_hours_en, ar: company?.working_hours_ar }) },
  ].filter((i) => i.value);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {info.map((item) => (
            <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-charcoal-100 bg-charcoal-50 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-charcoal-400">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="mt-1 block text-sm font-semibold text-charcoal-900 hover:text-brand-600" dir="ltr">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-charcoal-900">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {company?.maps_embed_url && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-charcoal-100">
            <iframe
              src={company.maps_embed_url}
              title="Location"
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>

      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card sm:p-8">
          <h3 className="text-xl font-semibold text-charcoal-900 font-display">{t("formTitle")}</h3>
          {form && fields.length > 0 ? (
            <div className="mt-6">
              <DynamicForm form={form} fields={fields} entityType="contact" />
            </div>
          ) : (
            <p className="mt-4 text-sm text-charcoal-500">
              {locale === "ar" ? "نموذج الاتصال غير متاح حالياً." : "The contact form is currently unavailable."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
