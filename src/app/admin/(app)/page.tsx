import { getAdminOverview, adminSubmissions } from "@/lib/admin-data";
import { getAdminT } from "@/lib/admin-i18n";
import { Inbox, Briefcase, GraduationCap, Users, Bell, Layers, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { t } = await getAdminT();
  const overview = await getAdminOverview();
  const submissions = await adminSubmissions();

  const byType: Record<string, number> = {};
  for (const s of submissions) byType[s.form_type] = (byType[s.form_type] ?? 0) + 1;

  const cards = [
    { label: t("totalServices"), value: overview.totalServices, icon: Briefcase },
    { label: t("activeCourses"), value: overview.activeCourses, icon: GraduationCap },
    { label: t("openJobs"), value: overview.openJobs, icon: Users },
    { label: t("newMessages"), value: byType.contact ?? 0, icon: Inbox },
    { label: t("serviceRequests"), value: byType.service ?? 0, icon: Layers },
    { label: t("applications"), value: byType.career ?? 0, icon: FileText },
    { label: t("registrations"), value: byType.course ?? 0, icon: GraduationCap },
    { label: t("unreadNotifications"), value: overview.unreadNotifications, icon: Bell },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-charcoal-500">{c.label}</p>
              <c.icon className="h-5 w-5 text-brand-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-charcoal-900">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-charcoal-100 px-6 py-4">
          <h2 className="font-semibold text-charcoal-900">{t("recentSubmissions")}</h2>
          <Link href="/admin/submissions" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            {t("view")}
          </Link>
        </div>
        {overview.recentSubmissions.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-charcoal-500">{t("noSubmissions")}</p>
        ) : (
          <ul className="divide-y divide-charcoal-100">
            {overview.recentSubmissions.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-6 py-3">
                <span className="rounded-full bg-charcoal-100 px-2.5 py-1 text-xs font-medium text-charcoal-600">
                  {t(s.form_type) || s.form_type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal-900">
                    {s.customer_name || s.email || "—"}
                  </p>
                  <p className="truncate text-xs text-charcoal-500">{s.email}</p>
                </div>
                <span className="text-xs text-charcoal-400">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
                <Link
                  href={`/admin/submissions/${s.id}`}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  {t("view")}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
