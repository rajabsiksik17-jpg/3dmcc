import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminPages } from "@/lib/admin-data";
import { savePage, deletePage } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "title_en", label: "Title (English)", half: true },
  { name: "title_ar", label: "Title (Arabic)", half: true },
  { name: "slug", label: "Slug", half: true },
  { name: "status", label: "Status", type: "select", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }], half: true },
  { name: "meta_title_en", label: "Meta Title (English)", half: true },
  { name: "meta_title_ar", label: "Meta Title (Arabic)", half: true },
  { name: "meta_description_en", label: "Meta Description (English)", type: "textarea" },
  { name: "meta_description_ar", label: "Meta Description (Arabic)", type: "textarea" },
];

export default async function PagesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { edit } = await searchParams;
  const pages = await adminPages();
  const editing = edit && edit !== "new" ? pages.find((p) => p.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">Pages</h1>
        <Link href="/admin/pages?edit=new" className="btn-primary !py-2">New Page</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? {}}
            action={savePage}
            cancelHref="/admin/pages"
            submitLabel={editing ? "Update Page" : "Create Page"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Title</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Slug</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Status</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{p.title_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.slug}</td>
                <td className="px-4 py-3"><span className={p.status === "published" ? "text-emerald-600" : "text-charcoal-400"}>{p.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/pages/${p.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">Sections</Link>
                    <Link href={`/admin/pages?edit=${p.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">Edit</Link>
                    <DeleteButton action={deletePage.bind(null, p.id)} />
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
