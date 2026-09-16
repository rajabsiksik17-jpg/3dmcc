"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, requirePermission, requireSuperAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { testSmtp } from "@/lib/email";
import type { Json, FormSubmissionRow, FormRow, PageRow, PageSectionRow, MediaRow } from "@/types/database";
import { revalidatePath } from "next/cache";

const admin = () => createAdminClient();

function handle(error: { message?: string } | null, ok = true) {
  return { ok: error ? false : ok, error: error?.message };
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export async function saveService(input: unknown) {
  await requirePermission("services.update");
  const parsed = z
    .object({
      id: z.string().optional(),
      title_en: z.string().min(1),
      title_ar: z.string().min(1),
      slug: z.string().optional(),
      short_description_en: z.string().optional(),
      short_description_ar: z.string().optional(),
      full_description_en: z.string().optional(),
      full_description_ar: z.string().optional(),
      icon: z.string().optional(),
      category_id: z.string().nullable().optional(),
      status: z.enum(["draft", "published"]).default("published"),
      featured: z.boolean().default(false),
      show_on_homepage: z.boolean().default(true),
      sort_order: z.number().default(0),
      featured_image: z.string().nullable().optional(),
      background_image: z.string().nullable().optional(),
    })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid data" };

  const d = parsed.data;
  const payload = {
    title_en: d.title_en,
    title_ar: d.title_ar,
    slug: d.slug?.trim() || slugify(d.title_en),
    short_description_en: d.short_description_en ?? null,
    short_description_ar: d.short_description_ar ?? null,
    full_description_en: d.full_description_en ?? null,
    full_description_ar: d.full_description_ar ?? null,
    icon: d.icon ?? null,
    category_id: d.category_id ?? null,
    status: d.status,
    featured: d.featured,
    show_on_homepage: d.show_on_homepage,
    sort_order: d.sort_order,
    featured_image: d.featured_image ?? null,
    background_image: d.background_image ?? null,
  };

  const { error } = d.id
    ? await admin().from("services").update(payload).eq("id", d.id)
    : await admin().from("services").insert(payload);

  revalidatePath("/", "layout");
  return handle(error);
}

export async function deleteService(id: string) {
  await requirePermission("services.delete");
  const { error } = await admin().from("services").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/", "layout");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------
export async function saveCourse(input: unknown) {
  await requirePermission("courses.update");
  const d = input as Record<string, unknown>;
  const payload = {
    title_en: String(d.title_en ?? ""),
    title_ar: String(d.title_ar ?? ""),
    slug: String(d.slug ?? "").trim() || slugify(String(d.title_en ?? "")),
    short_description_en: (d.short_description_en as string) ?? null,
    short_description_ar: (d.short_description_ar as string) ?? null,
    full_description_en: (d.full_description_en as string) ?? null,
    full_description_ar: (d.full_description_ar as string) ?? null,
    category_id: (d.category_id as string) ?? null,
    icon: (d.icon as string) ?? null,
    duration: (d.duration as string) ?? null,
    delivery_type: (d.delivery_type as string) ?? null,
    instructor_en: (d.instructor_en as string) ?? null,
    instructor_ar: (d.instructor_ar as string) ?? null,
    price: d.price != null ? Number(d.price) : null,
    offer_price: d.offer_price != null ? Number(d.offer_price) : null,
    currency: (d.currency as string) ?? "JOD",
    availability: (d.availability as string) ?? null,
    start_date: (d.start_date as string) ?? null,
    end_date: (d.end_date as string) ?? null,
    featured_image: (d.featured_image as string) ?? null,
    status: (d.status as "draft" | "published") ?? "published",
    featured: Boolean(d.featured),
    sort_order: Number(d.sort_order ?? 0),
  };
  const id = d.id as string | undefined;
  const { error } = id
    ? await admin().from("courses").update(payload).eq("id", id)
    : await admin().from("courses").insert(payload);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function deleteCourse(id: string) {
  await requirePermission("courses.delete");
  const { error } = await admin().from("courses").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/", "layout");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------
export async function saveJob(input: unknown) {
  await requirePermission("jobs.update");
  const d = input as Record<string, unknown>;
  const payload = {
    title_en: String(d.title_en ?? ""),
    title_ar: String(d.title_ar ?? ""),
    slug: String(d.slug ?? "").trim() || slugify(String(d.title_en ?? "")),
    department_en: (d.department_en as string) ?? null,
    department_ar: (d.department_ar as string) ?? null,
    description_en: (d.description_en as string) ?? null,
    description_ar: (d.description_ar as string) ?? null,
    location_en: (d.location_en as string) ?? null,
    location_ar: (d.location_ar as string) ?? null,
    employment_type: (d.employment_type as string) ?? null,
    deadline: (d.deadline as string) ?? null,
    icon: (d.icon as string) ?? null,
    featured_image: (d.featured_image as string) ?? null,
    form_id: (d.form_id as string) ?? null,
    status: (d.status as "draft" | "published") ?? "published",
    featured: Boolean(d.featured),
    sort_order: Number(d.sort_order ?? 0),
  };
  const id = d.id as string | undefined;
  const { error } = id
    ? await admin().from("jobs").update(payload).eq("id", id)
    : await admin().from("jobs").insert(payload);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function deleteJob(id: string) {
  await requirePermission("jobs.delete");
  const { error } = await admin().from("jobs").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/", "layout");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------
export async function saveTeamMember(input: unknown) {
  await requirePermission("team.manage");
  const d = input as Record<string, unknown>;
  const payload = {
    name_en: String(d.name_en ?? ""),
    name_ar: String(d.name_ar ?? ""),
    position_en: String(d.position_en ?? ""),
    position_ar: String(d.position_ar ?? ""),
    bio_en: (d.bio_en as string) ?? null,
    bio_ar: (d.bio_ar as string) ?? null,
    photo: (d.photo as string) ?? null,
    email: (d.email as string) ?? null,
    linkedin: (d.linkedin as string) ?? null,
    department: (d.department as string) ?? null,
    featured: Boolean(d.featured),
    active: Boolean(d.active ?? true),
    sort_order: Number(d.sort_order ?? 0),
  };
  const id = d.id as string | undefined;
  const { error } = id
    ? await admin().from("team_members").update(payload).eq("id", id)
    : await admin().from("team_members").insert(payload);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function deleteTeamMember(id: string) {
  await requirePermission("team.manage");
  const { error } = await admin().from("team_members").delete().eq("id", id);
  revalidatePath("/", "layout");
  return handle(error);
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
export async function saveFaq(input: unknown) {
  await requireAdmin();
  const d = input as Record<string, unknown>;
  const payload = {
    question_en: String(d.question_en ?? ""),
    question_ar: String(d.question_ar ?? ""),
    answer_en: String(d.answer_en ?? ""),
    answer_ar: String(d.answer_ar ?? ""),
    published: Boolean(d.published ?? true),
    sort_order: Number(d.sort_order ?? 0),
  };
  const id = d.id as string | undefined;
  const { error } = id
    ? await admin().from("faqs").update(payload).eq("id", id)
    : await admin().from("faqs").insert(payload);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  const { error } = await admin().from("faqs").delete().eq("id", id);
  revalidatePath("/", "layout");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------
export async function updateSubmission(input: unknown) {
  await requirePermission("applications.update");
  const d = input as { id: string; status?: string; assigned_to?: string | null; notes?: string | null };
  const payload: Partial<FormSubmissionRow> = { updated_at: new Date().toISOString() };
  if (d.status) payload.status = d.status as FormSubmissionRow["status"];
  if ("assigned_to" in d) payload.assigned_to = d.assigned_to;
  if ("notes" in d) payload.notes = d.notes;
  const { error } = await admin().from("form_submissions").update(payload).eq("id", d.id);
  revalidatePath("/admin");
  return handle(error);
}

export async function deleteSubmission(id: string) {
  await requirePermission("applications.update");
  const { error } = await admin().from("form_submissions").delete().eq("id", id);
  revalidatePath("/admin");
  return handle(error);
}

export async function archiveSubmission(id: string) {
  await requirePermission("applications.update");
  const { error } = await admin().from("form_submissions").update({ status: "archived" }).eq("id", id);
  revalidatePath("/admin");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export async function markNotificationRead(id: string): Promise<void> {
  await requireAdmin();
  await admin().from("notifications").update({ read: true }).eq("id", id);
  revalidatePath("/admin");
}

export async function markAllNotificationsRead(): Promise<void> {
  await requireAdmin();
  await admin().from("notifications").update({ read: true }).eq("read", false);
  revalidatePath("/admin");
}

export async function deleteNotification(id: string) {
  await requireAdmin();
  const { error } = await admin().from("notifications").delete().eq("id", id);
  revalidatePath("/admin");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Company settings
// ---------------------------------------------------------------------------
export async function saveCompanySettings(input: unknown) {
  await requirePermission("settings.manage");
  const d = input as Record<string, unknown>;
  const { error } = await admin()
    .from("company_settings")
    .update({
      name_en: String(d.name_en ?? "3DMCC"),
      name_ar: String(d.name_ar ?? "3DMCC"),
      short_description_en: (d.short_description_en as string) ?? null,
      short_description_ar: (d.short_description_ar as string) ?? null,
      full_description_en: (d.full_description_en as string) ?? null,
      full_description_ar: (d.full_description_ar as string) ?? null,
      logo_url: (d.logo_url as string) ?? null,
      logo_light_url: (d.logo_light_url as string) ?? null,
      favicon_url: (d.favicon_url as string) ?? null,
      phone: (d.phone as string) ?? null,
      whatsapp: (d.whatsapp as string) ?? null,
      email: (d.email as string) ?? null,
      secondary_email: (d.secondary_email as string) ?? null,
      address_en: (d.address_en as string) ?? null,
      address_ar: (d.address_ar as string) ?? null,
      city_en: (d.city_en as string) ?? null,
      city_ar: (d.city_ar as string) ?? null,
      country_en: (d.country_en as string) ?? null,
      country_ar: (d.country_ar as string) ?? null,
      working_hours_en: (d.working_hours_en as string) ?? null,
      working_hours_ar: (d.working_hours_ar as string) ?? null,
      maps_url: (d.maps_url as string) ?? null,
      maps_embed_url: (d.maps_embed_url as string) ?? null,
      latitude: d.latitude != null ? Number(d.latitude) : null,
      longitude: d.longitude != null ? Number(d.longitude) : null,
      facebook: (d.facebook as string) ?? null,
      instagram: (d.instagram as string) ?? null,
      linkedin: (d.linkedin as string) ?? null,
      youtube: (d.youtube as string) ?? null,
      twitter: (d.twitter as string) ?? null,
      website: (d.website as string) ?? null,
    })
    .neq("id", "00000000-0000-0000-0000-000000000000");
  revalidatePath("/", "layout");
  return handle(error);
}

// ---------------------------------------------------------------------------
// SEO settings
// ---------------------------------------------------------------------------
export async function saveSeoSettings(pageKey: string, input: unknown) {
  await requirePermission("settings.manage");
  const d = input as { title_en?: string; title_ar?: string; description_en?: string; description_ar?: string; keywords?: string; og_image?: string; robots?: string };
  const { error } = await admin()
    .from("seo_settings")
    .upsert(
      {
        page_key: pageKey,
        title_en: d.title_en ?? null,
        title_ar: d.title_ar ?? null,
        description_en: d.description_en ?? null,
        description_ar: d.description_ar ?? null,
        keywords: d.keywords ?? null,
        og_image: d.og_image ?? null,
        robots: d.robots ?? null,
      },
      { onConflict: "page_key" }
    );
  revalidatePath("/", "layout");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------
export async function saveIntegration(input: unknown) {
  await requireSuperAdmin();
  const d = input as { key: string; config: Json; enabled: boolean };
  const { error } = await admin()
    .from("integrations")
    .upsert({ key: d.key, config: d.config, enabled: d.enabled }, { onConflict: "key" });
  revalidatePath("/admin");
  return handle(error);
}

export async function saveEmailSettings(input: unknown) {
  await requireSuperAdmin();
  const d = input as Record<string, unknown>;
  const { encrypt } = await import("@/lib/email");
  const config: Record<string, Json> = {
    host: String(d.host ?? ""),
    port: Number(d.port ?? 587),
    user: String(d.user ?? ""),
    encryption: String(d.encryption ?? "tls"),
    fromName: String(d.fromName ?? "3DMCC"),
    fromEmail: String(d.fromEmail ?? "info@3dmcc.net"),
  };
  if (d.password) config.password = encrypt(String(d.password));
  const { error } = await admin().from("email_settings").upsert({ id: (await admin().from("email_settings").select("id").limit(1).maybeSingle()).data?.id ?? undefined, config: config as Json }, { onConflict: "id" });
  revalidatePath("/admin");
  return handle(error);
}

export async function testSmtpConnection() {
  await requireSuperAdmin();
  try {
    const res = await testSmtp();
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "SMTP test failed" };
  }
}

export async function testSmtpInput(input: unknown) {
  await requireSuperAdmin();
  const d = input as { host: string; port: number; user: string; password: string; encryption: string };
  const nodemailer = (await import("nodemailer")).default;
  try {
    const transporter = nodemailer.createTransport({
      host: d.host,
      port: Number(d.port || 587),
      secure: d.encryption === "ssl",
      auth: d.user ? { user: d.user, pass: d.password } : undefined,
      requireTLS: d.encryption !== "none",
      connectionTimeout: 10000,
    });
    await transporter.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "SMTP test failed" };
  }
}

export async function testImapConnection(input: unknown) {
  await requireSuperAdmin();
  const d = input as { host: string; port: number; encryption: string };
  // Real TCP/TLS connectivity check
  try {
    const net = await import("node:net");
    const tls = await import("node:tls");
    const host = d.host;
    const port = Number(d.port || 993);
    const secure = d.encryption === "ssl";

    await new Promise<void>((resolve, reject) => {
      const socket = secure
        ? tls.connect({ host, port, servername: host, rejectUnauthorized: false })
        : net.connect({ host, port });
      const timer = setTimeout(() => {
        socket.destroy();
        reject(new Error("Connection timed out"));
      }, 10000);
      socket.once("secureConnect", () => {
        clearTimeout(timer);
        socket.end();
        resolve();
      });
      socket.once("connect", () => {
        if (!secure) {
          clearTimeout(timer);
          socket.end();
          resolve();
        }
      });
      socket.once("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "IMAP connection failed" };
  }
}

export async function testAnalyticsConnection(input: unknown) {
  await requirePermission("settings.manage");
  const d = input as { measurementId: string };
  const id = d.measurementId?.trim();
  if (!id || !/^G-[A-Z0-9]{6,}$/i.test(id)) {
    return { ok: false, error: "Invalid Measurement ID format (expected G-XXXXXXX)" };
  }
  try {
    const res = await fetch(
      `https://www.google-analytics.com/debug/mp/collect?measurement_id=${id}&api_secret=test`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "3dmcc-test-client",
          events: [{ name: "connection_test" }],
        }),
      }
    );
    const text = await res.text();
    if (!res.ok && res.status !== 400) {
      return { ok: false, error: `Analytics endpoint returned ${res.status}` };
    }
    // The GA debug endpoint returns validation details; a valid measurement id
    // produces a JSON payload (even with validation_messages).
    return { ok: true, detail: text.slice(0, 200) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Analytics test failed" };
  }
}

// ---------------------------------------------------------------------------
// Users & roles
// ---------------------------------------------------------------------------
export async function updateUserRole(input: unknown) {
  await requireSuperAdmin();
  const d = input as { id: string; role: string };
  const { error } = await admin().from("profiles").update({ role: d.role }).eq("id", d.id);
  revalidatePath("/admin");
  return handle(error);
}

export async function createAdminUser(input: unknown) {
  await requireSuperAdmin();
  const d = input as { email: string; password: string; full_name: string; role: string };
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email: d.email,
    password: d.password,
    email_confirm: true,
    user_metadata: { full_name: d.full_name },
  });
  if (error) return { ok: false, error: error.message };
  if (data.user) {
    await admin().from("profiles").upsert({ id: data.user.id, email: d.email, full_name: d.full_name, role: d.role }, { onConflict: "id" });
  }
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteUser(id: string) {
  await requireSuperAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  revalidatePath("/admin");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Roles & permissions
// ---------------------------------------------------------------------------
export async function saveRole(input: unknown) {
  await requireSuperAdmin();
  const d = input as { id?: string; name: string; permissions: string[] };
  if (!d.name) return { ok: false, error: "Role name is required" };

  const permissions = Array.isArray(d.permissions) ? d.permissions : [];

  if (d.id) {
    const { error } = await admin()
      .from("roles")
      .update({ name: d.name, permissions: permissions as Json })
      .eq("id", d.id);
    revalidatePath("/admin");
    return handle(error);
  }

  const { error } = await admin()
    .from("roles")
    .upsert({ name: d.name, permissions: permissions as Json }, { onConflict: "name" });
  revalidatePath("/admin");
  return handle(error);
}

export async function deleteRole(name: string) {
  await requireSuperAdmin();
  if (name === "super_admin") return { ok: false, error: "Cannot delete super_admin" };
  const { error } = await admin().from("roles").delete().eq("name", name);
  revalidatePath("/admin");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Forms & fields
// ---------------------------------------------------------------------------
export async function saveForm(input: unknown) {
  await requireAdmin();
  const d = input as Record<string, unknown>;
  const payload = {
    name: String(d.name ?? ""),
    slug: String(d.slug ?? "").trim() || slugify(String(d.name ?? "")),
    type: (d.type as FormRow["type"]) ?? "custom",
    status: (d.status as FormRow["status"]) ?? "active",
    description: (d.description as string) ?? null,
    recipient_email: (d.recipient_email as string) ?? null,
    email_notification: Boolean(d.email_notification ?? true),
    auto_reply: Boolean(d.auto_reply ?? false),
    success_message_en: (d.success_message_en as string) ?? null,
    success_message_ar: (d.success_message_ar as string) ?? null,
  };
  const id = d.id as string | undefined;
  const { error } = id
    ? await admin().from("forms").update(payload).eq("id", id)
    : await admin().from("forms").insert(payload);
  revalidatePath("/admin");
  return handle(error);
}

export async function saveFormField(formId: string, input: unknown) {
  await requireAdmin();
  const d = input as Record<string, unknown>;
  const payload = {
    form_id: formId,
    label_en: String(d.label_en ?? ""),
    label_ar: String(d.label_ar ?? ""),
    name: String(d.name ?? "").trim().toLowerCase().replace(/\s+/g, "_"),
    type: (d.type as string) ?? "text",
    placeholder_en: (d.placeholder_en as string) ?? null,
    placeholder_ar: (d.placeholder_ar as string) ?? null,
    required: Boolean(d.required),
    width: (d.width as string) ?? "full",
    sort_order: Number(d.sort_order ?? 0),
  };
  const id = d.id as string | undefined;
  const { error } = id
    ? await admin().from("form_fields").update(payload).eq("id", id)
    : await admin().from("form_fields").insert(payload);
  revalidatePath("/admin");
  return handle(error);
}

export async function deleteFormField(id: string) {
  await requireAdmin();
  const { error } = await admin().from("form_fields").delete().eq("id", id);
  revalidatePath("/admin");
  return handle(error);
}

export async function deleteForm(id: string) {
  await requireAdmin();
  const { error } = await admin().from("forms").delete().eq("id", id);
  revalidatePath("/admin");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Pages & sections
// ---------------------------------------------------------------------------
export async function savePage(input: unknown) {
  await requirePermission("pages.update");
  const d = input as Record<string, unknown>;
  const payload = {
    title_en: String(d.title_en ?? ""),
    title_ar: String(d.title_ar ?? ""),
    slug: String(d.slug ?? "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    status: (d.status as PageRow["status"]) ?? "draft",
    meta_title_en: (d.meta_title_en as string) ?? null,
    meta_title_ar: (d.meta_title_ar as string) ?? null,
    meta_description_en: (d.meta_description_en as string) ?? null,
    meta_description_ar: (d.meta_description_ar as string) ?? null,
  };
  const id = d.id as string | undefined;
  const { error } = id
    ? await admin().from("pages").update(payload).eq("id", id)
    : await admin().from("pages").insert(payload);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function deletePage(id: string) {
  await requirePermission("pages.delete");
  const { error } = await admin().from("pages").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function saveSection(input: unknown) {
  await requirePermission("pages.update");
  const d = input as Record<string, unknown>;
  let content: Json = {};
  try {
    content = typeof d.content === "string" ? JSON.parse(d.content) : (d.content as Json);
  } catch {
    return { ok: false, error: "Invalid JSON content" };
  }
  const payload = {
    page_id: String(d.page_id),
    type: String(d.type),
    position: Number(d.position ?? 0),
    visibility: (d.visibility as PageSectionRow["visibility"]) ?? "visible",
    status: (d.status as PageSectionRow["status"]) ?? "published",
    content,
  };
  const id = d.id as string | undefined;
  const { error } = id
    ? await admin().from("page_sections").update(payload).eq("id", id)
    : await admin().from("page_sections").insert(payload);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function deleteSection(id: string) {
  await requirePermission("pages.update");
  const { error } = await admin().from("page_sections").delete().eq("id", id);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function reorderSection(id: string, direction: "up" | "down") {
  await requirePermission("pages.update");
  const { data: section } = await admin().from("page_sections").select("*").eq("id", id).maybeSingle();
  if (!section) return { ok: false, error: "Not found" };
  const delta = direction === "up" ? -1 : 1;
  const { error } = await admin().from("page_sections").update({ position: section.position + delta }).eq("id", id);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function duplicateSection(id: string) {
  await requirePermission("pages.update");
  const { data: section } = await admin().from("page_sections").select("*").eq("id", id).maybeSingle();
  if (!section) return { ok: false, error: "Not found" };
  const { error } = await admin().from("page_sections").insert({
    page_id: section.page_id,
    type: section.type,
    position: section.position + 1,
    visibility: section.visibility,
    content: section.content,
    background: section.background,
    layout: section.layout,
    animation: section.animation,
    responsive: section.responsive,
    status: section.status,
  });
  revalidatePath("/", "layout");
  return handle(error);
}

export async function reorderSections(ids: string[]) {
  await requirePermission("pages.update");
  for (let i = 0; i < ids.length; i++) {
    await admin().from("page_sections").update({ position: i + 1 }).eq("id", ids[i]);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------
export async function uploadMedia(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file" };
  if (file.size > 10 * 1024 * 1024) return { ok: false, error: "File too large (max 10MB)" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowed = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg", "pdf", "doc", "docx", "xls", "xlsx", "csv", "txt", "mp4"]);
  if (!allowed.has(ext)) return { ok: false, error: "File type not allowed" };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `media/${Date.now()}-${safeName}`;
  const bucket = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext) ? "public" : "public";

  const { error: uploadError } = await admin()
    .storage.from(bucket)
    .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
  if (uploadError) return { ok: false, error: uploadError.message };

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  const type = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext) ? "image" : ext === "mp4" ? "video" : "document";

  const { error } = await admin().from("media").insert({
    name: file.name,
    storage_path: path,
    url,
    type,
    mime_type: file.type,
    size: file.size,
    is_public: true,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  const { data: media } = await admin().from("media").select("*").eq("id", id).maybeSingle();
  if (media) {
    await admin().storage.from("public").remove([media.storage_path]);
  }
  const { error } = await admin().from("media").delete().eq("id", id);
  revalidatePath("/admin");
  return handle(error);
}

// ---------------------------------------------------------------------------
// Duplicate actions
// ---------------------------------------------------------------------------
export async function duplicateService(id: string) {
  await requirePermission("services.create");
  const { data } = await admin().from("services").select("*").eq("id", id).maybeSingle();
  if (!data) return { ok: false, error: "Not found" };
  const { title_en, title_ar, ...rest } = data;
  const { error } = await admin()
    .from("services")
    .insert({
      ...rest,
      title_en: `${title_en} (Copy)`,
      title_ar: `${title_ar} (نسخة)`,
      slug: `${data.slug}-copy-${Date.now()}`,
    });
  revalidatePath("/admin");
  return handle(error);
}

export async function duplicateCourse(id: string) {
  await requirePermission("courses.create");
  const { data } = await admin().from("courses").select("*").eq("id", id).maybeSingle();
  if (!data) return { ok: false, error: "Not found" };
  const { title_en, title_ar, ...rest } = data;
  const { error } = await admin()
    .from("courses")
    .insert({
      ...rest,
      title_en: `${title_en} (Copy)`,
      title_ar: `${title_ar} (نسخة)`,
      slug: `${data.slug}-copy-${Date.now()}`,
    });
  revalidatePath("/admin");
  return handle(error);
}

export async function duplicateJob(id: string) {
  await requirePermission("jobs.create");
  const { data } = await admin().from("jobs").select("*").eq("id", id).maybeSingle();
  if (!data) return { ok: false, error: "Not found" };
  const { title_en, title_ar, ...rest } = data;
  const { error } = await admin()
    .from("jobs")
    .insert({
      ...rest,
      title_en: `${title_en} (Copy)`,
      title_ar: `${title_ar} (نسخة)`,
      slug: `${data.slug}-copy-${Date.now()}`,
    });
  revalidatePath("/admin");
  return handle(error);
}

export async function duplicateForm(id: string) {
  await requireAdmin();
  const { data } = await admin().from("forms").select("*").eq("id", id).maybeSingle();
  if (!data) return { ok: false, error: "Not found" };
  const { data: inserted, error } = await admin()
    .from("forms")
    .insert({
      name: `${data.name} (Copy)`,
      slug: `${data.slug}-copy-${Date.now()}`,
      description: data.description,
      type: data.type,
      status: data.status,
      success_message_en: data.success_message_en,
      success_message_ar: data.success_message_ar,
      email_notification: data.email_notification,
      auto_reply: data.auto_reply,
      recipient_email: data.recipient_email,
    })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };

  const { data: fields } = await admin().from("form_fields").select("*").eq("form_id", id);
  if (fields && inserted) {
    await admin()
      .from("form_fields")
      .insert(
        fields.map((f) => ({
          form_id: inserted.id,
          label_en: f.label_en,
          label_ar: f.label_ar,
          name: f.name,
          type: f.type,
          placeholder_en: f.placeholder_en,
          placeholder_ar: f.placeholder_ar,
          required: f.required,
          width: f.width,
          sort_order: f.sort_order,
        }))
      );
  }
  revalidatePath("/admin");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function saveCategory(input: unknown) {
  await requireAdmin();
  const d = input as Record<string, unknown>;
  const kind = (d.kind as string) ?? "course";
  const payload = {
    name_en: String(d.name_en ?? ""),
    name_ar: String(d.name_ar ?? ""),
    slug: String(d.slug ?? "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || slugify(String(d.name_en ?? "")),
    icon: (d.icon as string) ?? null,
    image: (d.image as string) ?? null,
    description_en: (d.description_en as string) ?? null,
    description_ar: (d.description_ar as string) ?? null,
    status: (d.status as string) ?? "active",
    featured: Boolean(d.featured),
    sort_order: Number(d.sort_order ?? 0),
  };
  const id = d.id as string | undefined;

  const q = kind === "course"
    ? admin().from("course_categories")
    : admin().from("service_categories");

  const { error } = id
    ? await q.update(payload).eq("id", id)
    : await q.insert(payload);
  revalidatePath("/", "layout");
  return handle(error);
}

export async function deleteCategory(input: unknown) {
  await requireAdmin();
  const d = input as { id: string; kind: string };
  const q = d.kind === "course"
    ? admin().from("course_categories")
    : admin().from("service_categories");
  const { error } = await q.delete().eq("id", d.id);
  revalidatePath("/", "layout");
  return handle(error);
}
