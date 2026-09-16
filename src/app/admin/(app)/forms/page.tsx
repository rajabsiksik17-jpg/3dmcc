import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminForms } from "@/lib/admin-data";
import { saveForm, deleteForm, duplicateForm } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { DuplicateButton } from "@/components/admin/duplicate-button";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "name", label: "formName", half: true },
  { name: "slug", label: "slugOptional", half: true },
  { name: "type", label: "formType", type: "select", options: [
    { value: "contact", label: "contact" },
    { value: "service", label: "service" },
    { value: "career", label: "career" },
    { value: "course", label: "course" },
    { value: "custom", label: "custom" },
  ], half: true },
  { name: "status", label: "formStatus", type: "select", options: [{ value: "active", label: "active" }, { value: "inactive", label: "inactive" }], half: true },
  { name: "recipient_email", label: "recipientEmail", half: true },
  { name: "description", label: "description", type: "textarea" },
  { name: "success_message_en", label: "successMessageEn", type: "textarea" },
  { name: "success_message_ar", label: "successMessageAr", type: "textarea" },
  { name: "email_notification", label: "emailNotification", type: "toggle" },
  { name: "auto_reply", label: "autoReply", type: "toggle" },
];

export default async function FormsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { edit } = await searchParams;
  const forms = await adminForms();
  const editing = edit && edit !== "new" ? forms.find((f) => f.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">{t("forms")}</h1>
        <Link href="/admin/forms?edit=new" className="btn-primary !py-2">{t("newForm")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? { type: "custom", status: "active", email_notification: true }}
            action={saveForm}
            cancelHref="/admin/forms"
            submitLabel={editing ? "updateForm" : "createForm"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("name")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("type")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("status")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {forms.map((f) => (
              <tr key={f.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{f.name}</td>
                <td className="px-4 py-3 text-charcoal-600">{t(f.type)}</td>
                <td className="px-4 py-3"><span className={f.status === "active" ? "text-emerald-600" : "text-charcoal-400"}>{t(f.status)}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/forms/${f.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("fields")}</Link>
                    <Link href={`/admin/forms?edit=${f.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
                    <DuplicateButton action={duplicateForm.bind(null, f.id)} />
                    <DeleteButton action={deleteForm.bind(null, f.id)} />
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
