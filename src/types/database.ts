import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Manual Supabase Database type definitions.
 *
 * These mirror `supabase/migrations`. After connecting a live Supabase
 * project you can regenerate with:
 *   supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" > src/types/supabase.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Localized = {
  en: string;
  ar: string;
}

export type CompanySettingsRow = {
  id: string;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  full_description_en: string;
  full_description_ar: string;
  logo_url: string | null;
  logo_dark_url: string | null;
  logo_light_url: string | null;
  favicon_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  secondary_email: string | null;
  address_en: string | null;
  address_ar: string | null;
  city_en: string | null;
  city_ar: string | null;
  country_en: string | null;
  country_ar: string | null;
  working_hours_en: string | null;
  working_hours_ar: string | null;
  maps_url: string | null;
  maps_embed_url: string | null;
  latitude: number | null;
  longitude: number | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  twitter: string | null;
  website: string | null;
  brand: Json | null;
  created_at: string;
  updated_at: string;
}

export type PageRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  meta_keywords: string | null;
  og_title_en: string | null;
  og_title_ar: string | null;
  og_description_en: string | null;
  og_description_ar: string | null;
  og_image: string | null;
  canonical_url: string | null;
  robots: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type PageSectionRow = {
  id: string;
  page_id: string;
  type: string;
  position: number;
  visibility: "visible" | "hidden";
  content: Json;
  background: Json | null;
  layout: Json | null;
  animation: string | null;
  responsive: Json | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export type ServiceRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  short_description_en: string | null;
  short_description_ar: string | null;
  full_description_en: string | null;
  full_description_ar: string | null;
  benefits_en: Json | null;
  benefits_ar: Json | null;
  what_we_offer_en: Json | null;
  what_we_offer_ar: Json | null;
  who_for_en: Json | null;
  who_for_ar: Json | null;
  process_en: Json | null;
  process_ar: Json | null;
  featured_image: string | null;
  background_image: string | null;
  icon: string | null;
  category_id: string | null;
  form_id: string | null;
  status: "draft" | "published";
  featured: boolean;
  show_on_homepage: boolean;
  sort_order: number;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  meta_keywords: string | null;
  cta_text_en: string | null;
  cta_text_ar: string | null;
  cta_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CourseRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  short_description_en: string | null;
  short_description_ar: string | null;
  full_description_en: string | null;
  full_description_ar: string | null;
  learning_objectives_en: Json | null;
  learning_objectives_ar: Json | null;
  curriculum_en: Json | null;
  curriculum_ar: Json | null;
  target_audience_en: Json | null;
  target_audience_ar: Json | null;
  prerequisites_en: Json | null;
  prerequisites_ar: Json | null;
  icon: string | null;
  featured_image: string | null;
  category_id: string | null;
  form_id: string | null;
  duration: string | null;
  duration_ar: string | null;
  delivery_type: string | null;
  instructor_en: string | null;
  instructor_ar: string | null;
  start_date: string | null;
  end_date: string | null;
  schedule: string | null;
  price: number | null;
  offer_price: number | null;
  currency: string | null;
  availability: string | null;
  status: "draft" | "published";
  featured: boolean;
  sort_order: number;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type JobRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  department_en: string | null;
  department_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  responsibilities_en: Json | null;
  responsibilities_ar: Json | null;
  requirements_en: Json | null;
  requirements_ar: Json | null;
  qualifications_en: Json | null;
  qualifications_ar: Json | null;
  skills_en: Json | null;
  skills_ar: Json | null;
  benefits_en: Json | null;
  benefits_ar: Json | null;
  location_en: string | null;
  location_ar: string | null;
  employment_type: string | null;
  experience: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  deadline: string | null;
  status: "draft" | "published";
  featured: boolean;
  icon: string | null;
  featured_image: string | null;
  form_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type FormRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: "contact" | "service" | "career" | "course" | "custom";
  status: "active" | "inactive";
  success_message_en: string | null;
  success_message_ar: string | null;
  email_notification: boolean;
  auto_reply: boolean;
  recipient_email: string | null;
  created_at: string;
  updated_at: string;
}

export type FormFieldRow = {
  id: string;
  form_id: string;
  label_en: string;
  label_ar: string;
  name: string;
  type: string;
  placeholder_en: string | null;
  placeholder_ar: string | null;
  required: boolean;
  validation: Json | null;
  options: Json | null;
  default_value: Json | null;
  sort_order: number;
  visibility: "visible" | "hidden";
  conditional: Json | null;
  width: string | null;
  created_at: string;
}

export type FormSubmissionRow = {
  id: string;
  form_id: string;
  form_type: string;
  entity_type: string | null;
  entity_id: string | null;
  customer_name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  assigned_to: string | null;
  notes: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export type TeamMemberRow = {
  id: string;
  name_en: string;
  name_ar: string;
  position_en: string;
  position_ar: string;
  bio_en: string | null;
  bio_ar: string | null;
  photo: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  department: string | null;
  sort_order: number;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export type TestimonialRow = {
  id: string;
  client_name: string;
  position: string | null;
  company: string | null;
  photo: string | null;
  content_en: string;
  content_ar: string;
  rating: number | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export type FaqRow = {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  sort_order: number;
  published: boolean;
  course_id: string | null;
  job_id: string | null;
  created_at: string;
}

export type MenuRow = {
  id: string;
  name: string;
  location: string;
  created_at: string;
}

export type MenuItemRow = {
  id: string;
  menu_id: string;
  parent_id: string | null;
  label_en: string;
  label_ar: string;
  url: string | null;
  page_id: string | null;
  target: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export type NotificationRow = {
  id: string;
  type: string;
  title_en: string;
  title_ar: string;
  body_en: string | null;
  body_ar: string | null;
  read: boolean;
  resolved: boolean;
  entity_type: string | null;
  entity_id: string | null;
  user_id: string | null;
  created_at: string;
}

export type MediaRow = {
  id: string;
  name: string;
  storage_path: string;
  url: string | null;
  type: string;
  mime_type: string | null;
  size: number | null;
  alt: string | null;
  title: string | null;
  description: string | null;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
}

export type RoleRow = {
  id: string;
  name: string;
  permissions: Json;
  created_at: string;
}

export type EmailTemplateRow = {
  id: string;
  key: string;
  subject_en: string;
  subject_ar: string;
  body_en: string;
  body_ar: string;
  created_at: string;
  updated_at: string;
}

export type IntegrationRow = {
  id: string;
  key: string;
  config: Json;
  enabled: boolean;
  updated_at: string;
}

export type CategoryRow = {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  sort_order: number;
  icon: string | null;
  image: string | null;
  description_en: string | null;
  description_ar: string | null;
  status: string | null;
  featured: boolean | null;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  created_at: string;
}

export type ClientRow = {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
  is_demo: boolean;
  created_at: string;
}

export type PartnerRow = {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
  is_demo: boolean;
  created_at: string;
}

export type SeoSettingsRow = {
  id: string;
  page_key: string;
  title_en: string | null;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  keywords: string | null;
  og_image: string | null;
  robots: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  preferred_locale: string;
  created_at: string;
  updated_at: string;
}

export type ActivityLogRow = {
  id: string;
  user_id: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  before: Json | null;
  after: Json | null;
  metadata: Json | null;
  ip_address: string | null;
  created_at: string;
}

export type Tables = {
  company_settings: CompanySettingsRow;
  pages: PageRow;
  page_sections: PageSectionRow;
  services: ServiceRow;
  service_categories: CategoryRow;
  courses: CourseRow;
  course_categories: CategoryRow;
  jobs: JobRow;
  forms: FormRow;
  form_fields: FormFieldRow;
  form_submissions: FormSubmissionRow;
  form_submission_values: { id: string; submission_id: string; field_name: string; field_label: string | null; value: Json; created_at: string };
  notifications: NotificationRow;
  team_members: TeamMemberRow;
  clients: ClientRow;
  partners: PartnerRow;
  testimonials: TestimonialRow;
  faqs: FaqRow;
  media: MediaRow;
  menus: MenuRow;
  menu_items: MenuItemRow;
  email_settings: { id: string; config: Json; updated_at: string };
  email_templates: EmailTemplateRow;
  integrations: IntegrationRow;
  seo_settings: SeoSettingsRow;
  activity_logs: ActivityLogRow;
  audit_logs: ActivityLogRow;
  profiles: ProfileRow;
  roles: RoleRow;
  course_registrations: FormSubmissionRow;
  job_applications: FormSubmissionRow;
}

export type TableName = keyof Tables;
export type RowOf<T extends TableName> = Tables[T];

export type Database = {
  public: {
    Tables: {
      [K in TableName]: {
        Row: Tables[K];
        Insert: Partial<Tables[K]>;
        Update: Partial<Tables[K]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_public_form: {
        Args: {
          p_form_id: string;
          p_form_type: string;
          p_entity_type: string | null;
          p_entity_id: string | null;
          p_customer_name: string | null;
          p_email: string | null;
          p_phone: string | null;
          p_ip: string | null;
          p_values: Json;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type AppClient = SupabaseClient<Database>;
export type AppAdminClient = SupabaseClient<Database>;
