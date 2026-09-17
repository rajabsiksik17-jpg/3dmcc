import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminCourses, adminCategories, adminForms, adminFaqs } from "@/lib/admin-data";
import { saveCourse, deleteCourse, duplicateCourse } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { DuplicateButton } from "@/components/admin/duplicate-button";
import { EntityFaqsEditor } from "@/components/admin/entity-faqs-editor";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

function fields(categoryOptions: { value: string; label: string }[], formOptions: { value: string; label: string }[]): FieldDef[] {
  return [
    { name: "title_en", label: "titleEn", half: true },
    { name: "title_ar", label: "titleAr", half: true },
    { name: "slug", label: "slugOptional", half: true },
    { name: "category_id", label: "category", type: "select", options: categoryOptions, half: true },
    { name: "form_id", label: "applicationForm", type: "select", options: [{ value: "", label: "noForm" }, ...formOptions], half: true },
    { name: "duration", label: "duration", half: true },
    { name: "duration_ar", label: "durationAr", half: true },
    { name: "delivery_type", label: "deliveryType", type: "select", options: [
      { value: "in_person", label: "deliveryInPerson" },
      { value: "online", label: "deliveryOnline" },
      { value: "hybrid", label: "deliveryHybrid" },
    ], half: true },
    { name: "instructor_en", label: "instructorEn", half: true },
    { name: "instructor_ar", label: "instructorAr", half: true },
    { name: "price", label: "basePrice", type: "number", half: true, step: 0.01 },
    { name: "offer_price", label: "offerPrice", type: "number", half: true, step: 0.01 },
    {
      name: "availability", label: "availability", type: "select", half: true,
      options: [
        { value: "open", label: "availabilityOpen" },
        { value: "full", label: "availabilityFull" },
        { value: "closed", label: "availabilityClosed" },
      ],
    },
    { name: "start_date", label: "startDate", half: true, placeholder: "YYYY-MM-DD" },
    { name: "end_date", label: "endDate", half: true, placeholder: "YYYY-MM-DD" },
    { name: "status", label: "status", type: "select", options: [{ value: "published", label: "published" }, { value: "draft", label: "draft" }], half: true },
    { name: "sort_order", label: "sortOrder", type: "number", half: true },
    { name: "icon", label: "icon", type: "icon" },
    { name: "featured_image", label: "featuredImage", type: "image" },
    { name: "short_description_en", label: "shortDescriptionEn", type: "textarea" },
    { name: "short_description_ar", label: "shortDescriptionAr", type: "textarea" },
    { name: "full_description_en", label: "fullDescriptionEn", type: "textarea" },
    { name: "full_description_ar", label: "fullDescriptionAr", type: "textarea" },
    { name: "learning_objectives_en", label: "learningObjectivesEn", type: "list" },
    { name: "learning_objectives_ar", label: "learningObjectivesAr", type: "list" },
    { name: "curriculum_en", label: "curriculumEn", type: "list" },
    { name: "curriculum_ar", label: "curriculumAr", type: "list" },
    { name: "target_audience_en", label: "targetAudienceEn", type: "list" },
    { name: "target_audience_ar", label: "targetAudienceAr", type: "list" },
    { name: "prerequisites_en", label: "prerequisitesEn", type: "list" },
    { name: "prerequisites_ar", label: "prerequisitesAr", type: "list" },
    { name: "featured", label: "featured", type: "toggle" },
  ];
}

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { edit } = await searchParams;
  const [courses, { courses: categories }, forms, allFaqs] = await Promise.all([adminCourses(), adminCategories(), adminForms(), adminFaqs()]);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name_en }));
  const formOptions = forms
    .filter((f) => f.type === "course" || f.type === "custom")
    .map((f) => ({ value: f.id, label: f.name }));

  const defaultForm = forms.find((f) => f.type === "course") ?? forms.find((f) => f.type === "custom");
  const editing = edit && edit !== "new" ? courses.find((c) => c.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">{t("courses")}</h1>
        <Link href="/admin/courses?edit=new" className="btn-primary !py-2">{t("newCourse")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={fields(categoryOptions, formOptions)}
            initial={(editing as Record<string, unknown>) ?? { status: "published", availability: "open", icon: "GraduationCap", form_id: defaultForm?.id ?? "" }}
            action={saveCourse}
            cancelHref="/admin/courses"
            submitLabel={editing ? "updateCourse" : "createCourse"}
          />
          {editing && (
            <EntityFaqsEditor entityType="course" entityId={editing.id} faqs={allFaqs.filter((f) => f.course_id === editing.id)} />
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("title")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("category")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("duration")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("status")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{c.title_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{categories.find((x) => x.id === c.category_id)?.name_en ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal-600">{c.duration ?? "—"}</td>
                <td className="px-4 py-3"><span className={c.status === "published" ? "text-emerald-600" : "text-charcoal-400"}>{t(c.status)}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/courses?edit=${c.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                    <DuplicateButton action={duplicateCourse.bind(null, c.id)} />
                    <DeleteButton action={deleteCourse.bind(null, c.id)} />
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
