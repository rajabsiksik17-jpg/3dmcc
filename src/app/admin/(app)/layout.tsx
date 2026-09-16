import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminOverview } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();
  const overview = await getAdminOverview();

  return (
    <AdminShell unread={overview.unreadNotifications} role={profile.role} fullName={profile.full_name ?? ""}>
      {children}
    </AdminShell>
  );
}
