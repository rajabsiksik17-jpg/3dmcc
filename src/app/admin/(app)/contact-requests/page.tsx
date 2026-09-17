import { requirePermission } from "@/lib/auth";
import { getAdminT } from "@/lib/admin-i18n";
import { RequestList } from "@/components/admin/request-list";

export const dynamic = "force-dynamic";

export default async function ContactRequestsPage() {
  await requirePermission("applications.view");
  const { t } = await getAdminT();
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">{t("contactRequests")}</h1>
      <RequestList type="contact" />
    </div>
  );
}
