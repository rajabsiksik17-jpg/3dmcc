import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminCourseCategories } from "@/lib/admin-data";
import { saveCategory, deleteCategory } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "name_en", label: "nameEn", half: true },
  { name: "name_ar", label: "nameAr", half: true },
  { name: "slug", label: "slugOptional", half: true },
  { name: "status", label: "status", type: "select", options: [{ value: "active", label: "active" }, { value: "inactive", label: "inactive" }], half: true },
  { name: "sort_order", label: "sortOrder", type: "number", half: true },
  { name: "icon", label: "icon", type: "icon" },
  { name: "image", label: "image", type: "image" },
  { name: "description_en", label: "descriptionEn", type: "textarea" },
  { name: "description_ar", label: "descriptionAr", type: "textarea" },
  { name: "featured", label: "featured", type: "toggle" },
];

export default async function CourseCategoriesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t, locale } = await getAdminT();
  const { edit } = await searchParams;
  const categories = await adminCourseCategories();
  const editing = edit && edit !== "new" ? categories.find((c) => c.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">{t("courseCategories")}</h1>
        <Link href="/admin/course-categories?edit=new" className="btn-primary !py-2">{t("new")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={{ ...(editing as Record<string, unknown>), kind: "course", status: "active" }}
            action={saveCategory}
            cancelHref="/admin/course-categories"
            submitLabel={editing ? "update" : "create"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("name")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("status")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("sortOrder")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{locale === "ar" ? c.name_ar : c.name_en}</td>
                <td className="px-4 py-3"><span className={c.status === "active" ? "text-emerald-600" : "text-charcoal-400"}>{t(c.status ?? "active")}</span></td>
                <td className="px-4 py-3 text-charcoal-600">{c.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/course-categories?edit=${c.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                    <DeleteButton action={deleteCategory.bind(null, { id: c.id, kind: "course" })} />
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
