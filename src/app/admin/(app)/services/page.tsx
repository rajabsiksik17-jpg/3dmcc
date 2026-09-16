import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminServices, adminCategories } from "@/lib/admin-data";
import { saveService, deleteService } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "title_en", label: "Title (English)", half: true },
  { name: "title_ar", label: "Title (Arabic)", half: true },
  { name: "slug", label: "Slug (optional)", half: true, placeholder: "auto-generated" },
  { name: "icon", label: "Icon name", half: true, placeholder: "e.g. ClipboardCheck" },
  { name: "category_id", label: "Category", type: "select", half: true },
  { name: "status", label: "Status", type: "select", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }], half: true },
  { name: "sort_order", label: "Sort Order", type: "number", half: true },
  { name: "short_description_en", label: "Short Description (English)", type: "textarea" },
  { name: "short_description_ar", label: "Short Description (Arabic)", type: "textarea" },
  { name: "full_description_en", label: "Full Description (English)", type: "textarea" },
  { name: "full_description_ar", label: "Full Description (Arabic)", type: "textarea" },
  { name: "featured", label: "Featured", type: "toggle" },
];

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { edit } = await searchParams;
  const [services, { services: categories }] = await Promise.all([adminServices(), adminCategories()]);

  const fields = FIELDS.map((f) =>
    f.name === "category_id"
      ? { ...f, options: categories.map((c) => ({ value: c.id, label: c.name_en })) }
      : f
  );

  const editing = edit && edit !== "new" ? services.find((s) => s.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">Services</h1>
        <Link href="/admin/services?edit=new" className="btn-primary !py-2">
          New Service
        </Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={fields}
            initial={(editing as Record<string, unknown>) ?? {}}
            action={saveService}
            cancelHref="/admin/services"
            submitLabel={editing ? "Update Service" : "Create Service"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50 text-start">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Title</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Category</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Status</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Featured</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{s.title_en}</td>
                <td className="px-4 py-3 text-charcoal-600">
                  {categories.find((c) => c.id === s.category_id)?.name_en ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={s.status === "published" ? "text-emerald-600" : "text-charcoal-400"}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal-600">{s.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/services?edit=${s.id}`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteService.bind(null, s.id)} />
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
