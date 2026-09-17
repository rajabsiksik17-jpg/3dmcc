import Link from "next/link";
import { adminSubmissions, adminCourses, adminJobs } from "@/lib/admin-data";
import { getAdminT, type AdminLocale } from "@/lib/admin-i18n";
import { maskPhone, shortId } from "@/lib/mask";
import type { FormSubmissionRow } from "@/types/database";

const TYPE_KEY = { course: "course", career: "career", contact: "contact" } as const;

export async function RequestList({ type }: { type: "course" | "career" | "contact" }) {
  const { t, locale } = await getAdminT();
  const submissions = await adminSubmissions({ type: TYPE_KEY[type] });

  let entityNames: Map<string, string> = new Map();
  if (type === "course") {
    const courses = await adminCourses();
    entityNames = new Map(courses.map((c) => [c.id, locale === "ar" ? c.title_ar : c.title_en]));
  } else if (type === "career") {
    const jobs = await adminJobs();
    entityNames = new Map(jobs.map((j) => [j.id, locale === "ar" ? j.title_ar : j.title_en]));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
      <table className="w-full text-sm">
        <thead className="border-b border-charcoal-100 bg-charcoal-50">
          <tr>
            <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("requestNumber")}</th>
            {type !== "contact" && <th className="px-4 py-3 text-start font-medium text-charcoal-600">{type === "course" ? t("course") : t("career")}</th>}
            {type === "contact" && <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("customer")}</th>}
            <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("date")}</th>
            <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("status")}</th>
            <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("read")}</th>
            <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {submissions.length === 0 ? (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-charcoal-500">{t("noSubmissions")}</td></tr>
          ) : (
            submissions.map((s) => (
              <SubmissionRow key={s.id} s={s} locale={locale} entityName={entityNames.get(s.entity_id ?? "") ?? "—"} showEntity={type !== "contact"} t={t} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SubmissionRow({
  s,
  locale,
  entityName,
  showEntity,
  t,
}: {
  s: FormSubmissionRow;
  locale: AdminLocale;
  entityName: string;
  showEntity: boolean;
  t: (k: string) => string;
}) {
  return (
    <tr className={!s.read ? "bg-brand-50/30" : "hover:bg-charcoal-50"}>
      <td className="px-4 py-3 font-mono text-xs text-charcoal-500">#{shortId(s.id)}</td>
      {showEntity && <td className="px-4 py-3 font-medium text-charcoal-900">{entityName}</td>}
      {!showEntity && <td className="px-4 py-3 text-charcoal-900">
        <span className="font-medium">{s.customer_name || "—"}</span>
        <span className="block text-xs text-charcoal-400" dir="ltr">{maskPhone(s.phone)}</span>
      </td>}
      <td className="px-4 py-3 text-charcoal-600">{new Date(s.created_at).toLocaleDateString(locale === "ar" ? "ar-JO" : "en-GB")}</td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-charcoal-100 px-2.5 py-1 text-xs font-medium text-charcoal-600">{s.status}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`h-2.5 w-2.5 rounded-full inline-block ${s.read ? "bg-charcoal-200" : "bg-brand-500"}`} />
      </td>
      <td className="px-4 py-3 text-end">
        <Link href={`/admin/submissions/${s.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("view")}</Link>
      </td>
    </tr>
  );
}
