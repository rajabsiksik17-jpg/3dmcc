import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  CompanySettingsRow,
  PageRow,
  PageSectionRow,
  ServiceRow,
  CourseRow,
  JobRow,
  FormRow,
  FormFieldRow,
  CategoryRow,
  FaqRow,
  TeamMemberRow,
  TestimonialRow,
  ClientRow,
  PartnerRow,
  MenuItemRow,
  SeoSettingsRow,
} from "@/types/database";

const sb = () => createClient();

// ---------------------------------------------------------------------------
// Company / global
// ---------------------------------------------------------------------------
export const getCompanySettings = cache(async (): Promise<CompanySettingsRow | null> => {
  const { data } = await (await sb()).from("company_settings").select("*").limit(1).maybeSingle();
  return data;
});

export const getSeoSettings = cache(async (pageKey: string): Promise<SeoSettingsRow | null> => {
  const { data } = await (await sb())
    .from("seo_settings")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle();
  return data;
});

// ---------------------------------------------------------------------------
// Pages & sections
// ---------------------------------------------------------------------------
export const getPage = cache(async (slug: string): Promise<PageRow | null> => {
  const { data } = await (await sb())
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
});

export const getPageSections = cache(async (pageId: string): Promise<PageSectionRow[]> => {
  const { data } = await (await sb())
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .eq("status", "published")
    .eq("visibility", "visible")
    .order("position", { ascending: true });
  return data ?? [];
});

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export const getServiceCategories = cache(async (): Promise<CategoryRow[]> => {
  const { data } = await (await sb())
    .from("service_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getServices = cache(
  async (opts: { category?: string; featured?: boolean; limit?: number; homepage?: boolean } = {}): Promise<ServiceRow[]> => {
    let q = (await sb())
      .from("services")
      .select("*")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("title_en", { ascending: true });

    if (opts.category) q = q.eq("category_id", opts.category);
    if (opts.featured) q = q.eq("featured", true);
    if (opts.homepage) q = q.eq("show_on_homepage", true);
    if (opts.limit) q = q.limit(opts.limit);

    const { data } = await q;
    return data ?? [];
  }
);

export const getServiceBySlug = cache(async (slug: string): Promise<ServiceRow | null> => {
  const { data } = await (await sb())
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  return data;
});

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------
export const getCourseCategories = cache(async (): Promise<CategoryRow[]> => {
  const { data } = await (await sb())
    .from("course_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getCourses = cache(
  async (opts: { category?: string; featured?: boolean; limit?: number } = {}): Promise<CourseRow[]> => {
    let q = (await sb())
      .from("courses")
      .select("*")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    if (opts.category) q = q.eq("category_id", opts.category);
    if (opts.featured) q = q.eq("featured", true);
    if (opts.limit) q = q.limit(opts.limit);

    const { data } = await q;
    return data ?? [];
  }
);

export const getCourseBySlug = cache(async (slug: string): Promise<CourseRow | null> => {
  const { data } = await (await sb())
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  return data;
});

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------
export const getJobs = cache(async (): Promise<JobRow[]> => {
  const { data } = await (await sb())
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getJobBySlug = cache(async (slug: string): Promise<JobRow | null> => {
  const { data } = await (await sb())
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  return data;
});

// ---------------------------------------------------------------------------
// Team, testimonials, clients, partners, faqs
// ---------------------------------------------------------------------------
export const getTeamMembers = cache(async (): Promise<TeamMemberRow[]> => {
  const { data } = await (await sb())
    .from("team_members")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getTestimonials = cache(async (): Promise<TestimonialRow[]> => {
  const { data } = await (await sb())
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getClients = cache(async (): Promise<ClientRow[]> => {
  const { data } = await (await sb())
    .from("clients")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getPartners = cache(async (): Promise<PartnerRow[]> => {
  const { data } = await (await sb())
    .from("partners")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getFaqs = cache(
  async (opts: { courseId?: string; jobId?: string } = {}): Promise<FaqRow[]> => {
    let q = (await sb()).from("faqs").select("*").eq("published", true).order("sort_order", { ascending: true });
    if (opts.courseId) q = q.eq("course_id", opts.courseId);
    if (opts.jobId) q = q.eq("job_id", opts.jobId);
    const { data } = await q;
    return data ?? [];
  }
);

export const getGlobalFaqs = cache(async (): Promise<FaqRow[]> => {
  const { data } = await (await sb())
    .from("faqs")
    .select("*")
    .eq("published", true)
    .is("course_id", null)
    .is("job_id", null)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

// ---------------------------------------------------------------------------
// Menus
// ---------------------------------------------------------------------------
export const getMenuItems = cache(async (location: string): Promise<MenuItemRow[]> => {
  const { data: menu } = await (await sb())
    .from("menus")
    .select("*")
    .eq("location", location)
    .maybeSingle();
  if (!menu) return [];
  const { data } = await (await sb())
    .from("menu_items")
    .select("*")
    .eq("menu_id", menu.id)
    .eq("active", true)
    .is("parent_id", null)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------
export const getFormBySlug = cache(async (slug: string): Promise<FormRow | null> => {
  const { data } = await (await sb())
    .from("forms")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data;
});

export const getFormById = cache(async (id: string): Promise<FormRow | null> => {
  const { data } = await (await sb()).from("forms").select("*").eq("id", id).maybeSingle();
  return data;
});

export const getFormFields = cache(async (formId: string): Promise<FormFieldRow[]> => {
  const { data } = await (await sb())
    .from("form_fields")
    .select("*")
    .eq("form_id", formId)
    .eq("visibility", "visible")
    .order("sort_order", { ascending: true });
  return data ?? [];
});
