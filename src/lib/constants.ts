export const COMPANY = {
  name: "3DMCC",
  fullName: "3D for Management Consulting Company",
  phone: "+962 7 9237 9011",
  email: "info@3dmcc.net",
  website: "https://3dmcc.net",
} as const;

export const LOCALES = ["en", "ar"] as const;
export const DEFAULT_LOCALE = "en" as const;

export const FIELD_TYPES = [
  "text",
  "textarea",
  "email",
  "phone",
  "number",
  "date",
  "time",
  "select",
  "multiselect",
  "checkbox",
  "radio",
  "file",
  "url",
  "country",
  "city",
  "company_name",
  "job_title",
] as const;

export const SUBMISSION_STATUSES = [
  "new",
  "contacted",
  "in_progress",
  "completed",
  "rejected",
  "archived",
] as const;

export const EMPLOYMENT_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "freelance",
] as const;

export const FORM_TYPES = ["contact", "service", "career", "course", "custom"] as const;

export const ADMIN_ROLES = [
  "super_admin",
  "admin",
  "editor",
  "hr_manager",
  "content_manager",
] as const;

export const SECTION_TYPES = [
  "hero",
  "rich_text",
  "image_text",
  "services_grid",
  "courses_grid",
  "features",
  "approach",
  "vision_mission",
  "core_values",
  "timeline",
  "stats",
  "team",
  "clients",
  "partners",
  "testimonials",
  "cta",
  "contact",
  "faq",
  "gallery",
  "logo_cloud",
  "newsletter",
  "spacer",
  "divider",
] as const;
