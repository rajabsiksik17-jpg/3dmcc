import { requireAdmin } from "@/lib/auth";
import { adminCompany } from "@/lib/admin-data";
import { saveCompanySettings } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "name_en", label: "Company Name (English)", half: true },
  { name: "name_ar", label: "Company Name (Arabic)", half: true },
  { name: "phone", label: "Phone", half: true },
  { name: "whatsapp", label: "WhatsApp", half: true },
  { name: "email", label: "Email", half: true },
  { name: "secondary_email", label: "Secondary Email", half: true },
  { name: "website", label: "Website", half: true },
  { name: "logo_url", label: "Logo URL", half: true },
  { name: "logo_light_url", label: "Logo (Light) URL", half: true },
  { name: "favicon_url", label: "Favicon URL", half: true },
  { name: "address_en", label: "Address (English)", half: true },
  { name: "address_ar", label: "Address (Arabic)", half: true },
  { name: "city_en", label: "City (English)", half: true },
  { name: "city_ar", label: "City (Arabic)", half: true },
  { name: "country_en", label: "Country (English)", half: true },
  { name: "country_ar", label: "Country (Arabic)", half: true },
  { name: "working_hours_en", label: "Working Hours (English)", half: true },
  { name: "working_hours_ar", label: "Working Hours (Arabic)", half: true },
  { name: "maps_url", label: "Google Maps URL", half: true },
  { name: "maps_embed_url", label: "Google Maps Embed URL", half: true },
  { name: "latitude", label: "Latitude", type: "number", half: true, step: 0.000001 },
  { name: "longitude", label: "Longitude", type: "number", half: true, step: 0.000001 },
  { name: "facebook", label: "Facebook", half: true },
  { name: "instagram", label: "Instagram", half: true },
  { name: "linkedin", label: "LinkedIn", half: true },
  { name: "youtube", label: "YouTube", half: true },
  { name: "twitter", label: "X (Twitter)", half: true },
  { name: "short_description_en", label: "Short Description (English)", type: "textarea" },
  { name: "short_description_ar", label: "Short Description (Arabic)", type: "textarea" },
  { name: "full_description_en", label: "Full Description (English)", type: "textarea" },
  { name: "full_description_ar", label: "Full Description (Arabic)", type: "textarea" },
];

export default async function CompanyPage() {
  await requireAdmin();
  const company = await adminCompany();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">Company Information</h1>
      <AdminEntityForm
        fields={FIELDS}
        initial={(company as Record<string, unknown>) ?? {}}
        action={saveCompanySettings}
        cancelHref="/admin"
        submitLabel="Save Company Information"
      />
    </div>
  );
}
