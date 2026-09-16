"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid email or password" };
  }

  const supabase = await createClient();
  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: error.message };
  }

  // Ensure the user has a profile with an admin role
  const admin = createAdminClient();
  const { data: authData } = await supabase.auth.getUser();
  if (authData.user) {
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle();
    const allowed = ["super_admin", "admin", "editor", "hr_manager", "content_manager"];
    if (!profile || !allowed.includes(profile.role)) {
      await supabase.auth.signOut();
      return { ok: false, error: "You do not have access to the admin dashboard." };
    }
  }

  return { ok: true };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function forgotPassword(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = z.object({ email: z.string().email() }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid email" };

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/admin/reset-password`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function resetPassword(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = z.object({ password: z.string().min(8) }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Password must be at least 8 characters" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
