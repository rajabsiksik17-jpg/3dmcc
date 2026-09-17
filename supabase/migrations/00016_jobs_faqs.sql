-- =============================================================================
-- 3DMCC — Migration: Job benefits/experience + entity FAQs
-- =============================================================================

alter table public.jobs
  add column if not exists benefits_en jsonb,
  add column if not exists benefits_ar jsonb,
  add column if not exists experience text;

alter table public.faqs
  add column if not exists course_id uuid references public.courses (id) on delete cascade,
  add column if not exists job_id uuid references public.jobs (id) on delete cascade;

create index if not exists idx_faqs_course on public.faqs (course_id);
create index if not exists idx_faqs_job on public.faqs (job_id);
