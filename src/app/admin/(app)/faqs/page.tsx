import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminFaqs } from "@/lib/admin-data";
import { saveFaq, deleteFaq } from "@/app/admin/actions/content";
import { AdminEntityForm, type FieldDef } from "@/components/admin/admin-entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const FIELDS: FieldDef[] = [
  { name: "question_en", label: "questionEn", type: "textarea" },
  { name: "question_ar", label: "questionAr", type: "textarea" },
  { name: "answer_en", label: "answerEn", type: "textarea" },
  { name: "answer_ar", label: "answerAr", type: "textarea" },
  { name: "sort_order", label: "sortOrder", type: "number", half: true },
  { name: "published", label: "publishedLabel", type: "toggle" },
];

export default async function FaqsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { edit } = await searchParams;
  const faqs = await adminFaqs();
  const editing = edit && edit !== "new" ? faqs.find((f) => f.id === edit) : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">{t("faqs")}</h1>
        <Link href="/admin/faqs?edit=new" className="btn-primary !py-2">{t("newFaq")}</Link>
      </div>

      {edit && (
        <div className="mb-8">
          <AdminEntityForm
            fields={FIELDS}
            initial={(editing as Record<string, unknown>) ?? { published: true }}
            action={saveFaq}
            cancelHref="/admin/faqs"
            submitLabel={editing ? "updateFaq" : "createFaq"}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("questionEn")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("publishedLabel")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {faqs.map((f) => (
              <tr key={f.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{f.question_en}</td>
                <td className="px-4 py-3 text-charcoal-600">{f.published ? t("yes") : t("no")}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/faqs?edit=${f.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</Link>
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
