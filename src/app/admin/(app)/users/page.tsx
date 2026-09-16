import { requireSuperAdmin, getCurrentUser } from "@/lib/auth";
import { adminProfiles, adminRoles } from "@/lib/admin-data";
import { UsersManager } from "@/components/admin/users-manager";
import { RolesManager } from "@/components/admin/roles-manager";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireSuperAdmin();
  const { t } = await getAdminT();
  const [profiles, roles, currentUser] = await Promise.all([adminProfiles(), adminRoles(), getCurrentUser()]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 text-xl font-semibold text-charcoal-900">{t("users")}</h1>
        <UsersManager profiles={profiles} currentUserId={currentUser?.id ?? ""} />
      </div>
      <RolesManager roles={roles} />
    </div>
  );
}
