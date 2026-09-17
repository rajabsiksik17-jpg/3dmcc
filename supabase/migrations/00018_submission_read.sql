-- =============================================================================
-- 3DMCC — Submissions read/unread + request tracking
-- =============================================================================

alter table public.form_submissions
  add column if not exists read boolean not null default false;

create index if not exists idx_form_submissions_read on public.form_submissions (read);
