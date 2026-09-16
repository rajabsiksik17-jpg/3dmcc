import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  ServiceRow,
  CourseRow,
  JobRow,
  TeamMemberRow,
  FaqRow,
  FormRow,
  FormFieldRow,
  FormSubmissionRow,
  NotificationRow,
  PageRow,
  PageSectionRow,
  CompanySettingsRow,
  SeoSettingsRow,
  CategoryRow,
  ProfileRow,
  IntegrationRow,
  MediaRow,
  RoleRow,
} from "@/types/database";

const admin = () => createAdminClient();

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------
export async function getAdminOverview() {
  const a = admin();
  const [
    submissions,
    services,
    courses,
    jobs,
    unread,
    users,
    notifications,
  ] = await Promise.all([
    a.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(20),
    a.from("services").select("id,status").is("deleted_at", null),
    a.from("courses").select("id,status").is("deleted_at", null),
    a.from("jobs").select("id,status").is("deleted_at", null),
    a.from("notifications").select("id").eq("read", false),
    a.from("profiles").select("id"),
    a.from("notifications").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  const count = (rows: { status: string }[] | null, status?: string) =>
    (rows ?? []).filter((r) => !status || r.status === status).length;

  return {
    newSubmissions: count(submissions.data, "new"),
    totalServices: count(services.data),
    publishedServices: count(services.data, "published"),
    activeCourses: count(courses.data, "published"),
    openJobs: count(jobs.data, "published"),
    unreadNotifications: unread.data?.length ?? 0,
    totalUsers: users.data?.length ?? 0,
    recentSubmissions: (submissions.data ?? []).slice(0, 8),
    recentNotifications: notifications.data ?? [],
  };
}

// ---------------------------------------------------------------------------
// Entities (admin, full access)
// ---------------------------------------------------------------------------
export async function adminServices(): Promise<ServiceRow[]> {
  const { data } = await admin().from("services").select("*").is("deleted_at", null).order("sort_order").order("title_en");
  return data ?? [];
}

export async function adminCourses(): Promise<CourseRow[]> {
  const { data } = await admin().from("courses").select("*").is("deleted_at", null).order("sort_order").order("title_en");
  return data ?? [];
}

export async function adminJobs(): Promise<JobRow[]> {
  const { data } = await admin().from("jobs").select("*").is("deleted_at", null).order("sort_order").order("title_en");
  return data ?? [];
}

export async function adminTeam(): Promise<TeamMemberRow[]> {
  const { data } = await admin().from("team_members").select("*").order("sort_order");
  return data ?? [];
}

export async function adminFaqs(): Promise<FaqRow[]> {
  const { data } = await admin().from("faqs").select("*").order("sort_order");
  return data ?? [];
}

export async function adminForms(): Promise<FormRow[]> {
  const { data } = await admin().from("forms").select("*").order("name");
  return data ?? [];
}

export async function adminFormFields(formId: string): Promise<FormFieldRow[]> {
  const { data } = await admin().from("form_fields").select("*").eq("form_id", formId).order("sort_order");
  return data ?? [];
}

export async function adminSubmissions(filter?: { type?: string; status?: string }): Promise<FormSubmissionRow[]> {
  let q = admin().from("form_submissions").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter?.type) q = q.eq("form_type", filter.type);
  if (filter?.status) q = q.eq("status", filter.status);
  const { data } = await q;
  return data ?? [];
}

export async function adminSubmissionValues(submissionId: string) {
  const { data } = await admin().from("form_submission_values").select("*").eq("submission_id", submissionId);
  return data ?? [];
}

export async function adminNotifications(): Promise<NotificationRow[]> {
  const { data } = await admin().from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
  return data ?? [];
}

export async function adminPages(): Promise<PageRow[]> {
  const { data } = await admin().from("pages").select("*").is("deleted_at", null).order("title_en");
  return data ?? [];
}

export async function adminPageSections(pageId: string): Promise<PageSectionRow[]> {
  const { data } = await admin().from("page_sections").select("*").eq("page_id", pageId).order("position");
  return data ?? [];
}

export async function adminCompany(): Promise<CompanySettingsRow | null> {
  const { data } = await admin().from("company_settings").select("*").limit(1).maybeSingle();
  return data;
}

export async function adminSeoSettings(): Promise<SeoSettingsRow[]> {
  const { data } = await admin().from("seo_settings").select("*").order("page_key");
  return data ?? [];
}

export async function adminIntegrations(): Promise<IntegrationRow[]> {
  const { data } = await admin().from("integrations").select("*");
  return data ?? [];
}

export async function adminProfiles(): Promise<ProfileRow[]> {
  const { data } = await admin().from("profiles").select("*").order("created_at");
  return data ?? [];
}

export async function adminCategories(): Promise<{ services: CategoryRow[]; courses: CategoryRow[] }> {
  const [s, c] = await Promise.all([
    admin().from("service_categories").select("*").order("sort_order"),
    admin().from("course_categories").select("*").order("sort_order"),
  ]);
  return { services: s.data ?? [], courses: c.data ?? [] };
}

export async function adminCourseCategories(): Promise<CategoryRow[]> {
  const { data } = await admin().from("course_categories").select("*").order("sort_order");
  return data ?? [];
}

export async function adminServiceCategories(): Promise<CategoryRow[]> {
  const { data } = await admin().from("service_categories").select("*").order("sort_order");
  return data ?? [];
}

export async function adminMedia(): Promise<MediaRow[]> {
  const { data } = await admin().from("media").select("*").order("created_at", { ascending: false }).limit(200);
  return data ?? [];
}

export async function adminRoles(): Promise<RoleRow[]> {
  const { data } = await admin().from("roles").select("*").order("name");
  return data ?? [];
}
