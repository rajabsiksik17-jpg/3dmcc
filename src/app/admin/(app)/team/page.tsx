import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminTeam } from "@/lib/admin-data";
import { saveTeamMember, deleteTeamMember } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "name_en", label: "nameEn", half: true },
  { name: "name_ar", label: "nameAr", half: true },
  { name: "position_en", label: "positionEn", half: true },
  { name: "position_ar", label: "positionAr", half: true },
  { name: "department", label: "department", half: true },
  { name: "email", label: "email", half: true },
  { name: "linkedin", label: "linkedin", half: true },
  { name: "sort_order", label: "sortOrder", type: "number", half: true },
  { name: "photo", label: "image", type: "image" },
  { name: "bio_en", label: "bioEn", type: "textarea" },
  { name: "bio_ar", label: "bioAr", type: "textarea" },
  { name: "featured", label: "featured", type: "toggle" },
  { name: "active", label: "active", type: "toggle" },
];

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t, locale } = await getAdminT();
  const { edit } = await searchParams;
  const team = await adminTeam();
  const editing = edit && edit !== "new" ? team.find((x) => x.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">{t("team")}</h1>
        <Link href="/admin/team?edit=new" className="btn-primary !py-2">{t("newMember")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? { active: true }}
            action={saveTeamMember}
            cancelHref="/admin/team"
            submitLabel={editing ? "updateMember" : "createMember"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("name")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("positionEn")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("department")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("active")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {team.map((m) => (
              <tr key={m.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{locale === "ar" ? m.name_ar : m.name_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{locale === "ar" ? m.position_ar : m.position_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{m.department ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal-600">{m.active ? t("yes") : t("no")}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/team?edit=${m.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                    <DeleteButton action={deleteTeamMember.bind(null, m.id)} />
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
