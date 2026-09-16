-- =============================================================================
-- 3DMCC — Migration: CMS enhancements (additive, safe)
-- =============================================================================

-- Services: control homepage visibility
alter table public.services
  add column if not exists show_on_homepage boolean not null default true;

-- Courses: offer pricing + end date + icon
alter table public.courses
  add column if not exists offer_price numeric,
  add column if not exists end_date date,
  add column if not exists icon text;

-- Jobs: featured + icon
alter table public.jobs
  add column if not exists featured boolean not null default false,
  add column if not exists icon text;

-- Service categories: icon + image
alter table public.service_categories
  add column if not exists icon text,
  add column if not exists image text,
  add column if not exists description_en text,
  add column if not exists description_ar text,
  add column if not exists status text not null default 'active',
  add column if not exists featured boolean not null default false;

-- Course categories: icon, image, description, status, seo
alter table public.course_categories
  add column if not exists icon text,
  add column if not exists image text,
  add column if not exists description_en text,
  add column if not exists description_ar text,
  add column if not exists status text not null default 'active',
  add column if not exists featured boolean not null default false,
  add column if not exists seo_title_en text,
  add column if not exists seo_title_ar text,
  add column if not exists seo_description_en text,
  add column if not exists seo_description_ar text;

-- Normalize course availability to translation keys
update public.courses set availability = 'open' where availability = 'Open for registration';
update public.courses set availability = 'open' where availability = 'متاح للتسجيل';
