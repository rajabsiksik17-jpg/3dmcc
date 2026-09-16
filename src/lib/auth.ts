import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProfileRow } from "@/types/database";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}

export const getCurrentProfile = cache(async (): Promise<ProfileRow | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  return getProfile(user.id);
});

export async function requireAdmin(): Promise<ProfileRow> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");
  return profile;
}

export async function requireSuperAdmin(): Promise<ProfileRow> {
  const profile = await requireAdmin();
  if (profile.role !== "super_admin") redirect("/admin");
  return profile;
}

export async function getRolePermissions(role: string): Promise<string[]> {
  const admin = createAdminClient();
  const { data } = await admin.from("roles").select("permissions").eq("name", role).maybeSingle();
  if (!data?.permissions) return [];
  return Array.isArray(data.permissions) ? (data.permissions as string[]) : [];
}

export async function hasPermission(perm: string): Promise<boolean> {
  const profile = await getCurrentProfile();
  if (!profile) return false;
  if (profile.role === "super_admin") return true;
  const perms = await getRolePermissions(profile.role);
  return perms.includes(perm);
}

export async function requirePermission(perm: string): Promise<ProfileRow> {
  const profile = await requireAdmin();
  if (profile.role === "super_admin") return profile;
  const perms = await getRolePermissions(profile.role);
  if (!perms.includes(perm)) redirect("/admin");
  return profile;
}
