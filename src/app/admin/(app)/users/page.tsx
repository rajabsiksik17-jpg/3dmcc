import { requireSuperAdmin, getCurrentUser } from "@/lib/auth";
import { adminProfiles } from "@/lib/admin-data";
import { UsersManager } from "@/components/admin/users-manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireSuperAdmin();
  const [profiles, currentUser] = await Promise.all([adminProfiles(), getCurrentUser()]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">Users & Roles</h1>
      <UsersManager profiles={profiles} currentUserId={currentUser?.id ?? ""} />
    </div>
  );
}
