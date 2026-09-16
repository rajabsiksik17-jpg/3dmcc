import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminSeoSettings } from "@/lib/admin-data";
import { saveSeoSettings } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "title_en", label: "seoTitleEn", type: "textarea" },
  { name: "title_ar", label: "seoTitleAr", type: "textarea" },
  { name: "description_en", label: "metaDescriptionEn", type: "textarea" },
  { name: "description_ar", label: "metaDescriptionAr", type: "textarea" },
  { name: "keywords", label: "keywords", type: "textarea" },
  { name: "robots", label: "robots", half: true, placeholder: "index, follow" },
];

export default async function SeoPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { edit } = await searchParams;
  const settings = await adminSeoSettings();
  const editing = settings.find((s) => s.page_key === edit);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">{t("seo")}</h1>

      {editing && (
        <div className="mb-8">
          <h2 className="mb-3 font-medium text-charcoal-700">{t("editing")}: {editing.page_key}</h2>
          <AdminEntityForm
            fields={FIELDS}
            initial={{ ...editing } as unknown as Record<string, unknown>}
            action={saveSeoSettings.bind(null, editing.page_key)}
            cancelHref="/admin/seo"
            submitLabel="saveSeo"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("pages")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("title")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {settings.map((s) => (
              <tr key={s.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{s.page_key}</td>
                <td className="px-4 py-3 text-charcoal-600">{s.title_en ?? "—"}</td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/seo?edit=${s.page_key}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
