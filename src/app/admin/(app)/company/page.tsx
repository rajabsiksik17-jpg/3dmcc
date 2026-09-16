import { requireAdmin } from "@/lib/auth";
import { adminCompany } from "@/lib/admin-data";
import { saveCompanySettings } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "name_en", label: "companyNameEn", half: true },
  { name: "name_ar", label: "companyNameAr", half: true },
  { name: "phone", label: "phone", half: true },
  { name: "whatsapp", label: "whatsapp", half: true },
  { name: "email", label: "email", half: true },
  { name: "secondary_email", label: "secondaryEmail", half: true },
  { name: "website", label: "website", half: true },
  { name: "logo_url", label: "logoUrl", type: "image" },
  { name: "logo_light_url", label: "logoLightUrl", type: "image" },
  { name: "favicon_url", label: "faviconUrl", half: true },
  { name: "address_en", label: "addressEn", half: true },
  { name: "address_ar", label: "addressAr", half: true },
  { name: "city_en", label: "cityEn", half: true },
  { name: "city_ar", label: "cityAr", half: true },
  { name: "country_en", label: "countryEn", half: true },
  { name: "country_ar", label: "countryAr", half: true },
  { name: "working_hours_en", label: "workingHoursEn", half: true },
  { name: "working_hours_ar", label: "workingHoursAr", half: true },
  { name: "maps_url", label: "mapsUrl", half: true },
  { name: "maps_embed_url", label: "mapsEmbedUrl", half: true },
  { name: "latitude", label: "latitude", type: "number", half: true, step: 0.000001 },
  { name: "longitude", label: "longitude", type: "number", half: true, step: 0.000001 },
  { name: "facebook", label: "facebook", half: true },
  { name: "instagram", label: "instagram", half: true },
  { name: "linkedin", label: "linkedin", half: true },
  { name: "youtube", label: "youtube", half: true },
  { name: "twitter", label: "twitter", half: true },
  { name: "short_description_en", label: "shortDescriptionEn", type: "textarea" },
  { name: "short_description_ar", label: "shortDescriptionAr", type: "textarea" },
  { name: "full_description_en", label: "fullDescriptionEn", type: "textarea" },
  { name: "full_description_ar", label: "fullDescriptionAr", type: "textarea" },
];

export default async function CompanyPage() {
  await requireAdmin();
  const { t } = await getAdminT();
  const company = await adminCompany();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">{t("company")}</h1>
      <AdminEntityForm
        fields={FIELDS}
        initial={(company as Record<string, unknown>) ?? {}}
        action={saveCompanySettings}
        cancelHref="/admin"
        submitLabel="saveCompany"
      />
    </div>
  );
}
