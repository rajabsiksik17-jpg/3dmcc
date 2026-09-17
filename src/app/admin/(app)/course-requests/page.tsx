import { requirePermission } from "@/lib/auth";
import { getAdminT } from "@/lib/admin-i18n";
import { RequestList } from "@/components/admin/request-list";

export const dynamic = "force-dynamic";

export default async function CourseRequestsPage() {
  await requirePermission("applications.view");
  const { t } = await getAdminT();
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">{t("courseRequests")}</h1>
      <RequestList type="course" />
    </div>
  );
}
