import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminJobs } from "@/lib/admin-data";
import { saveJob, deleteJob } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "title_en", label: "Title (English)", half: true },
  { name: "title_ar", label: "Title (Arabic)", half: true },
  { name: "slug", label: "Slug (optional)", half: true },
  { name: "department_en", label: "Department (English)", half: true },
  { name: "department_ar", label: "Department (Arabic)", half: true },
  { name: "location_en", label: "Location (English)", half: true },
  { name: "location_ar", label: "Location (Arabic)", half: true },
  {
    name: "employment_type", label: "Employment Type", type: "select", half: true,
    options: [
      { value: "full_time", label: "Full Time" },
      { value: "part_time", label: "Part Time" },
      { value: "contract", label: "Contract" },
      { value: "internship", label: "Internship" },
      { value: "freelance", label: "Freelance" },
    ],
  },
  { name: "deadline", label: "Deadline (YYYY-MM-DD)", half: true },
  { name: "status", label: "Status", type: "select", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }], half: true },
  { name: "description_en", label: "Description (English)", type: "textarea" },
  { name: "description_ar", label: "Description (Arabic)", type: "textarea" },
];

export default async function CareersPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { edit } = await searchParams;
  const jobs = await adminJobs();
  const editing = edit && edit !== "new" ? jobs.find((j) => j.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">Careers</h1>
        <Link href="/admin/careers?edit=new" className="btn-primary !py-2">New Job</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? {}}
            action={saveJob}
            cancelHref="/admin/careers"
            submitLabel={editing ? "Update Job" : "Create Job"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Title</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Department</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Type</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Status</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{j.title_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{j.department_en ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal-600">{j.employment_type ?? "—"}</td>
                <td className="px-4 py-3"><span className={j.status === "published" ? "text-emerald-600" : "text-charcoal-400"}>{j.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/careers?edit=${j.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">Edit</Link>
                    <DeleteButton action={deleteJob.bind(null, j.id)} />
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
