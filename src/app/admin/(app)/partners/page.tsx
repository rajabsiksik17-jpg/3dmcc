import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminPartners } from "@/lib/admin-data";
import { savePartner, deletePartner } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "name", label: "name", half: true },
  { name: "website", label: "website", half: true },
  { name: "sort_order", label: "sortOrder", type: "number", half: true },
  { name: "logo", label: "logo", type: "image" },
  { name: "description", label: "description", type: "textarea" },
  { name: "featured", label: "featured", type: "toggle" },
  { name: "active", label: "active", type: "toggle" },
  { name: "is_demo", label: "demoRecord", type: "toggle" },
];

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { edit } = await searchParams;
  const partners = await adminPartners();
  const editing = edit && edit !== "new" ? partners.find((c) => c.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">{t("partners")}</h1>
        <Link href="/admin/partners?edit=new" className="btn-primary !py-2">{t("new")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? { active: true }}
            action={savePartner}
            cancelHref="/admin/partners"
            submitLabel={editing ? "update" : "create"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("logo")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("name")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("active")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {partners.map((c) => (
              <tr key={c.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3">
                  {c.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.logo} alt={c.name} className="h-9 w-16 rounded bg-white object-contain" />
                  ) : (
                    <span className="text-charcoal-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-charcoal-900">{c.name}</td>
                <td className="px-4 py-3 text-charcoal-600">{c.active ? t("yes") : t("no")}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/partners?edit=${c.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                    <DeleteButton action={deletePartner.bind(null, c.id)} />
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
