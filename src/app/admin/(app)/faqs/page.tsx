import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminFaqs } from "@/lib/admin-data";
import { saveFaq, deleteFaq } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "question_en", label: "Question (English)", type: "textarea" },
  { name: "question_ar", label: "Question (Arabic)", type: "textarea" },
  { name: "answer_en", label: "Answer (English)", type: "textarea" },
  { name: "answer_ar", label: "Answer (Arabic)", type: "textarea" },
  { name: "sort_order", label: "Sort Order", type: "number", half: true },
  { name: "published", label: "Published", type: "toggle" },
];

export default async function FaqsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { edit } = await searchParams;
  const faqs = await adminFaqs();
  const editing = edit && edit !== "new" ? faqs.find((f) => f.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">FAQs</h1>
        <Link href="/admin/faqs?edit=new" className="btn-primary !py-2">New FAQ</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? {}}
            action={saveFaq}
            cancelHref="/admin/faqs"
            submitLabel={editing ? "Update FAQ" : "Create FAQ"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Question</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Published</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {faqs.map((f) => (
              <tr key={f.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{f.question_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{f.published ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/faqs?edit=${f.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">Edit</Link>
                    <DeleteButton action={deleteFaq.bind(null, f.id)} />
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
