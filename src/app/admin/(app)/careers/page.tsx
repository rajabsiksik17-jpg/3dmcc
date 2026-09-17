import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminJobs, adminForms, adminFaqs } from "@/lib/admin-data";
import { saveJob, deleteJob, duplicateJob } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { DuplicateButton } from "@/components/admin/duplicate-button";
import { EntityFaqsEditor } from "@/components/admin/entity-faqs-editor";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

function fields(formOptions: { value: string; label: string }[]): FieldDef[] {
  return [
    { name: "title_en", label: "titleEn", half: true },
    { name: "title_ar", label: "titleAr", half: true },
    { name: "slug", label: "slugOptional", half: true },
    { name: "department_en", label: "departmentEn", half: true },
    { name: "department_ar", label: "departmentAr", half: true },
    { name: "location_en", label: "locationEn", half: true },
    { name: "location_ar", label: "locationAr", half: true },
    {
      name: "employment_type", label: "employmentType", type: "select", half: true,
      options: [
        { value: "full_time", label: "fullTime" },
        { value: "part_time", label: "partTime" },
        { value: "contract", label: "contract" },
        { value: "internship", label: "internship" },
        { value: "freelance", label: "freelance" },
      ],
    },
    { name: "deadline", label: "deadline", half: true },
    { name: "experience", label: "experience", half: true },
    { name: "status", label: "status", type: "select", options: [{ value: "published", label: "published" }, { value: "draft", label: "draft" }], half: true },
    { name: "sort_order", label: "sortOrder", type: "number", half: true },
    { name: "form_id", label: "applicationForm", type: "select", options: [{ value: "", label: "noForm" }, ...formOptions], half: true },
    { name: "icon", label: "icon", type: "icon" },
    { name: "featured_image", label: "featuredImage", type: "image" },
    { name: "description_en", label: "descriptionEn", type: "textarea" },
    { name: "description_ar", label: "descriptionAr", type: "textarea" },
    { name: "responsibilities_en", label: "responsibilitiesEn", type: "list" },
    { name: "responsibilities_ar", label: "responsibilitiesAr", type: "list" },
    { name: "requirements_en", label: "requirementsEn", type: "list" },
    { name: "requirements_ar", label: "requirementsAr", type: "list" },
    { name: "qualifications_en", label: "qualificationsEn", type: "list" },
    { name: "qualifications_ar", label: "qualificationsAr", type: "list" },
    { name: "skills_en", label: "skillsEn", type: "list" },
    { name: "skills_ar", label: "skillsAr", type: "list" },
    { name: "benefits_en", label: "benefitsEn", type: "list" },
    { name: "benefits_ar", label: "benefitsAr", type: "list" },
    { name: "featured", label: "featured", type: "toggle" },
  ];
}

export default async function CareersPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t, locale } = await getAdminT();
  const { edit } = await searchParams;
  const [jobs, forms, allFaqs] = await Promise.all([adminJobs(), adminForms(), adminFaqs()]);

  const formOptions = forms
    .filter((f) => f.type === "career" || f.type === "custom")
    .map((f) => ({ value: f.id, label: f.name }));

  const defaultForm = forms.find((f) => f.type === "career") ?? forms.find((f) => f.type === "custom");
  const editing = edit && edit !== "new" ? jobs.find((j) => j.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">{t("careers")}</h1>
        <Link href="/admin/careers?edit=new" className="btn-primary !py-2">{t("newJob")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={fields(formOptions)}
            initial={(editing as Record<string, unknown>) ?? { status: "published", icon: "Briefcase", form_id: defaultForm?.id ?? "" }}
            action={saveJob}
            cancelHref="/admin/careers"
            submitLabel={editing ? "updateJob" : "createJob"}
          />
          {editing && (
            <EntityFaqsEditor entityType="job" entityId={editing.id} faqs={allFaqs.filter((f) => f.job_id === editing.id)} />
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("title")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("department")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("type")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("status")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{locale === "ar" ? j.title_ar : j.title_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{locale === "ar" ? j.department_ar : j.department_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{j.employment_type ? t(j.employment_type) : "—"}</td>
                <td className="px-4 py-3"><span className={j.status === "published" ? "text-emerald-600" : "text-charcoal-400"}>{t(j.status)}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/careers?edit=${j.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                    <DuplicateButton action={duplicateJob.bind(null, j.id)} />
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
