import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminTeam } from "@/lib/admin-data";
import { saveTeamMember, deleteTeamMember } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "name_en", label: "Name (English)", half: true },
  { name: "name_ar", label: "Name (Arabic)", half: true },
  { name: "position_en", label: "Position (English)", half: true },
  { name: "position_ar", label: "Position (Arabic)", half: true },
  { name: "department", label: "Department", half: true },
  { name: "email", label: "Email", half: true },
  { name: "linkedin", label: "LinkedIn URL", half: true },
  { name: "photo", label: "Photo URL", half: true },
  { name: "sort_order", label: "Sort Order", type: "number", half: true },
  { name: "bio_en", label: "Bio (English)", type: "textarea" },
  { name: "bio_ar", label: "Bio (Arabic)", type: "textarea" },
  { name: "featured", label: "Featured", type: "toggle" },
  { name: "active", label: "Active", type: "toggle" },
];

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { edit } = await searchParams;
  const team = await adminTeam();
  const editing = edit && edit !== "new" ? team.find((t) => t.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">Team</h1>
        <Link href="/admin/team?edit=new" className="btn-primary !py-2">New Member</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? {}}
            action={saveTeamMember}
            cancelHref="/admin/team"
            submitLabel={editing ? "Update Member" : "Create Member"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Name</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Position</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Department</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Active</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {team.map((t) => (
              <tr key={t.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{t.name_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{t.position_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{t.department ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal-600">{t.active ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/team?edit=${t.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">Edit</Link>
                    <DeleteButton action={deleteTeamMember.bind(null, t.id)} />
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
