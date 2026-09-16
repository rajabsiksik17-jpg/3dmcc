import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminForms, adminFormFields } from "@/lib/admin-data";
import { saveFormField, deleteFormField } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const FIELD_TYPES = [
  "text", "textarea", "email", "phone", "number", "date", "time", "datetime",
  "select", "multiselect", "radio", "checkbox", "country", "file", "url",
  "hidden", "password", "city", "company_name", "job_title",
];

const FIELDS: FieldDef[] = [
  { name: "label_en", label: "fieldLabelEn", half: true },
  { name: "label_ar", label: "fieldLabelAr", half: true },
  { name: "name", label: "fieldName", half: true },
  { name: "type", label: "fieldType", type: "select", options: FIELD_TYPES.map((t) => ({ value: t, label: t })), half: true },
  { name: "placeholder_en", label: "placeholderEn", half: true },
  { name: "placeholder_ar", label: "placeholderAr", half: true },
  { name: "width", label: "fieldWidth", type: "select", options: [{ value: "full", label: "full" }, { value: "half", label: "half" }], half: true },
  { name: "sort_order", label: "sortOrder", type: "number", half: true },
  { name: "required", label: "required", type: "toggle" },
];

export default async function FormFieldsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { id } = await params;
  const { edit } = await searchParams;

  const forms = await adminForms();
  const form = forms.find((f) => f.id === id);
  if (!form) notFound();

  const fields = await adminFormFields(id);
  const editing = edit && edit !== "new" ? fields.find((f) => f.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/forms" className="text-sm text-charcoal-500 hover:text-brand-600">{t("backToForms")}</Link>
          <h1 className="mt-1 text-xl font-semibold text-charcoal-900">{form.name} — {t("fields")}</h1>
        </div>
        <Link href={`/admin/forms/${id}?edit=new`} className="btn-primary !py-2">{t("addField")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? {}}
            action={saveFormField.bind(null, id)}
            cancelHref={`/admin/forms/${id}`}
            submitLabel={editing ? "updateField" : "addField"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("fieldLabelEn")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("fieldName")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("fieldType")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("required")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {fields.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-charcoal-500">{t("noFields")}</td></tr>
            ) : (
              fields.map((f) => (
                <tr key={f.id} className="hover:bg-charcoal-50">
                  <td className="px-4 py-3 font-medium text-charcoal-900">{f.label_en}</td>
                  <td className="px-4 py-3 text-charcoal-600">{f.name}</td>
                  <td className="px-4 py-3 text-charcoal-600">{f.type}</td>
                  <td className="px-4 py-3 text-charcoal-600">{f.required ? t("yes") : t("no")}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/forms/${id}?edit=${f.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                      <DeleteButton action={deleteFormField.bind(null, f.id)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
