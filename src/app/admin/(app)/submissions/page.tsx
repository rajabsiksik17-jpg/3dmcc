import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminSubmissions } from "@/lib/admin-data";
import { archiveSubmission } from "@/app/admin/actions/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

const TYPES = [
  { value: "contact", label: "contact" },
  { value: "service", label: "service" },
  { value: "career", label: "career" },
  { value: "course", label: "course" },
];

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { type } = await searchParams;
  const submissions = await adminSubmissions({ type });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">{t("submissions")}</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/submissions" className={!type ? "btn-primary !py-1.5" : "btn-secondary !py-1.5"}>{t("all")}</Link>
        {TYPES.map((x) => (
          <Link
            key={x.value}
            href={`/admin/submissions?type=${x.value}`}
            className={type === x.value ? "btn-primary !py-1.5" : "btn-secondary !py-1.5"}
          >
            {t(x.label)}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("customer")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("type")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("contact")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("status")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("date")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {submissions.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-charcoal-500">{t("noSubmissions")}</td></tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className="hover:bg-charcoal-50">
                  <td className="px-4 py-3 font-medium text-charcoal-900">{s.customer_name || "—"}</td>
                  <td className="px-4 py-3 text-charcoal-600">{t(s.form_type) || s.form_type}</td>
                  <td className="px-4 py-3 text-charcoal-600">
                    <span className="block text-xs">{s.email || "—"}</span>
                    <span className="block text-xs text-charcoal-400">{s.phone || ""}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-600">{new Date(s.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/submissions/${s.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("view")}</Link>
                      <DeleteButton action={archiveSubmission.bind(null, s.id)} confirmText={t("archiveSubmission")} />
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
