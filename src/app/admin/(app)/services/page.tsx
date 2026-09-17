import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminServices, adminCategories, adminForms } from "@/lib/admin-data";
import { saveService, deleteService, duplicateService } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { DuplicateButton } from "@/components/admin/duplicate-button";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

function fields(categoryOptions: { value: string; label: string }[], formOptions: { value: string; label: string }[]): FieldDef[] {
  return [
    { name: "title_en", label: "titleEn", half: true },
    { name: "title_ar", label: "titleAr", half: true },
    { name: "slug", label: "slugOptional", half: true, placeholder: "auto-generated" },
    { name: "category_id", label: "category", type: "select", options: categoryOptions, half: true },
    { name: "form_id", label: "applicationForm", type: "select", options: [{ value: "", label: "noForm" }, ...formOptions], half: true },
    { name: "status", label: "status", type: "select", options: [{ value: "published", label: "published" }, { value: "draft", label: "draft" }], half: true },
    { name: "sort_order", label: "sortOrder", type: "number", half: true },
    { name: "icon", label: "icon", type: "icon" },
    { name: "featured_image", label: "featuredImage", type: "image" },
    { name: "background_image", label: "backgroundImage", type: "image" },
    { name: "short_description_en", label: "shortDescriptionEn", type: "textarea" },
    { name: "short_description_ar", label: "shortDescriptionAr", type: "textarea" },
    { name: "full_description_en", label: "fullDescriptionEn", type: "textarea" },
    { name: "full_description_ar", label: "fullDescriptionAr", type: "textarea" },
    { name: "featured", label: "featured", type: "toggle" },
    { name: "show_on_homepage", label: "showOnHomepage", type: "toggle" },
  ];
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { edit } = await searchParams;
  const [services, { services: categories }, forms] = await Promise.all([adminServices(), adminCategories(), adminForms()]);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name_en }));
  const formOptions = forms
    .filter((f) => f.type === "service" || f.type === "custom" || f.type === "contact")
    .map((f) => ({ value: f.id, label: f.name }));
  const defaultForm = forms.find((f) => f.type === "service") ?? forms.find((f) => f.type === "custom");
  const editing = edit && edit !== "new" ? services.find((s) => s.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">{t("services")}</h1>
        <Link href="/admin/services?edit=new" className="btn-primary !py-2">{t("newService")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={fields(categoryOptions, formOptions)}
            initial={(editing as Record<string, unknown>) ?? { show_on_homepage: true, status: "published", icon: "Briefcase", form_id: defaultForm?.id ?? "" }}
            action={saveService}
            cancelHref="/admin/services"
            submitLabel={editing ? "updateService" : "createService"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("title")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("category")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("status")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("featured")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{s.title_en}</td>
                <td className="px-4 py-3 text-charcoal-600">
                  {categories.find((c) => c.id === s.category_id)?.name_en ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={s.status === "published" ? "text-emerald-600" : "text-charcoal-400"}>
                    {t(s.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal-600">{s.featured ? t("yes") : t("no")}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/services?edit=${s.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                    <DuplicateButton action={duplicateService.bind(null, s.id)} />
                    <DeleteButton action={deleteService.bind(null, s.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
