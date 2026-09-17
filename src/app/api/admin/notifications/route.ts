import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const allowed = ["super_admin", "admin", "editor", "hr_manager", "content_manager"];
  if (!profile || !allowed.includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [{ data: notifications }, { count }] = await Promise.all([
    admin.from("notifications").select("*").order("created_at", { ascending: false }).limit(20),
    admin.from("notifications").select("*", { count: "exact", head: true }).eq("read", false),
  ]);

  return NextResponse.json({
    notifications: notifications ?? [],
    unread: count ?? 0,
  });
}
