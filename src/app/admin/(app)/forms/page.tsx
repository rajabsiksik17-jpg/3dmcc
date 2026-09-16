import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminForms } from "@/lib/admin-data";
import { saveForm, deleteForm } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Form Name", half: true },
  { name: "slug", label: "Slug (optional)", half: true },
  { name: "type", label: "Type", type: "select", options: [
    { value: "contact", label: "Contact" },
    { value: "service", label: "Service" },
    { value: "career", label: "Career" },
    { value: "course", label: "Course" },
    { value: "custom", label: "Custom" },
  ], half: true },
  { name: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }], half: true },
  { name: "recipient_email", label: "Notification Email", half: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "success_message_en", label: "Success Message (English)", type: "textarea" },
  { name: "success_message_ar", label: "Success Message (Arabic)", type: "textarea" },
  { name: "email_notification", label: "Email Notification", type: "toggle" },
  { name: "auto_reply", label: "Auto Reply", type: "toggle" },
];

export default async function FormsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { edit } = await searchParams;
  const forms = await adminForms();
  const editing = edit && edit !== "new" ? forms.find((f) => f.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">Forms</h1>
        <Link href="/admin/forms?edit=new" className="btn-primary !py-2">New Form</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? {}}
            action={saveForm}
            cancelHref="/admin/forms"
            submitLabel={editing ? "Update Form" : "Create Form"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Name</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Type</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Status</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {forms.map((f) => (
              <tr key={f.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{f.name}</td>
                <td className="px-4 py-3 text-charcoal-600">{f.type}</td>
                <td className="px-4 py-3"><span className={f.status === "active" ? "text-emerald-600" : "text-charcoal-400"}>{f.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/forms/${f.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">Fields</Link>
                    <Link href={`/admin/forms?edit=${f.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">Edit</Link>
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
