-- =============================================================================
-- 3DMCC — Core schema
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Roles & profiles (RBAC)
-- ---------------------------------------------------------------------------
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  permissions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'content_manager' references public.roles (name) on update cascade,
  preferred_locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Company settings (single row)
-- ---------------------------------------------------------------------------
create table public.company_settings (
  id uuid primary key default gen_random_uuid(),
  name_en text not null default '3DMCC',
  name_ar text not null default '3DMCC',
  short_description_en text,
  short_description_ar text,
  full_description_en text,
  full_description_ar text,
  logo_url text,
  logo_dark_url text,
  logo_light_url text,
  favicon_url text,
  phone text,
  whatsapp text,
  email text,
  secondary_email text,
  address_en text,
  address_ar text,
  city_en text,
  city_ar text,
  country_en text,
  country_ar text,
  working_hours_en text,
  working_hours_ar text,
  maps_url text,
  maps_embed_url text,
  latitude double precision,
  longitude double precision,
  facebook text,
  instagram text,
  linkedin text,
  youtube text,
  twitter text,
  website text,
  brand jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Pages & sections (dynamic page builder)
-- ---------------------------------------------------------------------------
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ar text not null,
  meta_title_en text,
  meta_title_ar text,
  meta_description_en text,
  meta_description_ar text,
  meta_keywords text,
  og_title_en text,
  og_title_ar text,
  og_description_en text,
  og_description_ar text,
  og_image text,
  canonical_url text,
  robots text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  type text not null,
  position integer not null default 0,
  visibility text not null default 'visible' check (visibility in ('visible','hidden')),
  content jsonb not null default '{}'::jsonb,
  background jsonb,
  layout jsonb,
  animation text,
  responsive jsonb,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.course_categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ar text not null,
  short_description_en text,
  short_description_ar text,
  full_description_en text,
  full_description_ar text,
  benefits_en jsonb,
  benefits_ar jsonb,
  what_we_offer_en jsonb,
  what_we_offer_ar jsonb,
  who_for_en jsonb,
  who_for_ar jsonb,
  process_en jsonb,
  process_ar jsonb,
  featured_image text,
  background_image text,
  icon text,
  category_id uuid references public.service_categories (id) on delete set null,
  form_id uuid,
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  meta_title_en text,
  meta_title_ar text,
  meta_description_en text,
  meta_description_ar text,
  meta_keywords text,
  cta_text_en text,
  cta_text_ar text,
  cta_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Courses
-- ---------------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ar text not null,
  short_description_en text,
  short_description_ar text,
  full_description_en text,
  full_description_ar text,
  learning_objectives_en jsonb,
  learning_objectives_ar jsonb,
  curriculum_en jsonb,
  curriculum_ar jsonb,
  target_audience_en jsonb,
  target_audience_ar jsonb,
  prerequisites_en jsonb,
  prerequisites_ar jsonb,
  featured_image text,
  category_id uuid references public.course_categories (id) on delete set null,
  form_id uuid,
  duration text,
  delivery_type text,
  instructor_en text,
  instructor_ar text,
  start_date date,
  schedule text,
  price numeric,
  currency text default 'JOD',
  availability text,
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  meta_title_en text,
  meta_title_ar text,
  meta_description_en text,
  meta_description_ar text,
  meta_keywords text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Jobs / careers
-- ---------------------------------------------------------------------------
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ar text not null,
  department_en text,
  department_ar text,
  description_en text,
  description_ar text,
  responsibilities_en jsonb,
  responsibilities_ar jsonb,
  requirements_en jsonb,
  requirements_ar jsonb,
  qualifications_en jsonb,
  qualifications_ar jsonb,
  skills_en jsonb,
  skills_ar jsonb,
  location_en text,
  location_ar text,
  employment_type text check (employment_type in ('full_time','part_time','contract','internship','freelance')),
  salary_min numeric,
  salary_max numeric,
  salary_currency text default 'JOD',
  deadline date,
  status text not null default 'draft' check (status in ('draft','published')),
  featured_image text,
  form_id uuid,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Forms (dynamic form builder)
-- ---------------------------------------------------------------------------
create table public.forms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  type text not null default 'custom' check (type in ('contact','service','career','course','custom')),
  status text not null default 'active' check (status in ('active','inactive')),
  success_message_en text,
  success_message_ar text,
  email_notification boolean not null default true,
  auto_reply boolean not null default false,
  recipient_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms (id) on delete cascade,
  label_en text not null,
  label_ar text not null,
  name text not null,
  type text not null,
  placeholder_en text,
  placeholder_ar text,
  required boolean not null default false,
  validation jsonb,
  options jsonb,
  default_value jsonb,
  sort_order integer not null default 0,
  visibility text not null default 'visible' check (visibility in ('visible','hidden')),
  conditional jsonb,
  width text default 'full',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Form submissions
-- ---------------------------------------------------------------------------
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid references public.forms (id) on delete set null,
  form_type text not null default 'custom',
  entity_type text,
  entity_id uuid,
  customer_name text,
  email text,
  phone text,
  status text not null default 'new' check (status in ('new','contacted','in_progress','completed','rejected','archived')),
  assigned_to uuid references auth.users (id) on delete set null,
  notes text,
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_submission_values (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.form_submissions (id) on delete cascade,
  field_name text not null,
  field_label text,
  value jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title_en text not null,
  title_ar text not null,
  body_en text,
  body_ar text,
  read boolean not null default false,
  resolved boolean not null default false,
  entity_type text,
  entity_id uuid,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Team, clients, partners, testimonials, faqs
-- ---------------------------------------------------------------------------
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  position_en text not null,
  position_ar text not null,
  bio_en text,
  bio_ar text,
  photo text,
  email text,
  phone text,
  linkedin text,
  department text,
  sort_order integer not null default 0,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  website text,
  description text,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  website text,
  description text,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  position text,
  company text,
  photo text,
  content_en text not null,
  content_ar text not null,
  rating integer check (rating between 1 and 5),
  published boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question_en text not null,
  question_ar text not null,
  answer_en text not null,
  answer_ar text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Media library
-- ---------------------------------------------------------------------------
create table public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  storage_path text not null,
  url text,
  type text not null default 'image',
  mime_type text,
  size bigint,
  alt text,
  title text,
  description text,
  is_public boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Menus
-- ---------------------------------------------------------------------------
create table public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null unique,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus (id) on delete cascade,
  parent_id uuid references public.menu_items (id) on delete cascade,
  label_en text not null,
  label_ar text not null,
  url text,
  page_id uuid references public.pages (id) on delete set null,
  target text not null default '_self',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Integrations & email
-- ---------------------------------------------------------------------------
create table public.email_settings (
  id uuid primary key default gen_random_uuid(),
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.email_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  subject_en text not null,
  subject_ar text not null,
  body_en text not null,
  body_ar text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  title_en text,
  title_ar text,
  description_en text,
  description_ar text,
  keywords text,
  og_image text,
  robots text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Activity & audit logs
-- ---------------------------------------------------------------------------
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity text,
  entity_id uuid,
  before jsonb,
  after jsonb,
  metadata jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity text,
  entity_id uuid,
  before jsonb,
  after jsonb,
  metadata jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index idx_page_sections_page on public.page_sections (page_id, position);
create index idx_services_category on public.services (category_id);
create index idx_services_status on public.services (status);
create index idx_courses_category on public.courses (category_id);
create index idx_courses_status on public.courses (status);
create index idx_jobs_status on public.jobs (status);
create index idx_form_fields_form on public.form_fields (form_id, sort_order);
create index idx_form_submissions_form on public.form_submissions (form_id, created_at desc);
create index idx_submission_values_submission on public.form_submission_values (submission_id);
create index idx_notifications_read on public.notifications (read);
create index idx_notifications_created on public.notifications (created_at desc);
create index idx_menu_items_menu on public.menu_items (menu_id, sort_order);
create index idx_activity_logs_created on public.activity_logs (created_at desc);
