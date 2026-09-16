-- =============================================================================
-- 3DMCC — Row Level Security
-- =============================================================================

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.company_settings enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.service_categories enable row level security;
alter table public.course_categories enable row level security;
alter table public.services enable row level security;
alter table public.courses enable row level security;
alter table public.jobs enable row level security;
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.form_submissions enable row level security;
alter table public.form_submission_values enable row level security;
alter table public.notifications enable row level security;
alter table public.team_members enable row level security;
alter table public.clients enable row level security;
alter table public.partners enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.media enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.email_settings enable row level security;
alter table public.email_templates enable row level security;
alter table public.integrations enable row level security;
alter table public.seo_settings enable row level security;
alter table public.activity_logs enable row level security;
alter table public.audit_logs enable row level security;

-- =============================================================================
-- PUBLIC (anon) READ — published content only
-- =============================================================================

create policy "company_settings public read" on public.company_settings
  for select using (true);

create policy "pages public read published" on public.pages
  for select using (status = 'published');

create policy "page_sections public read published" on public.page_sections
  for select using (status = 'published');

create policy "service_categories public read" on public.service_categories
  for select using (true);

create policy "course_categories public read" on public.course_categories
  for select using (true);

create policy "services public read published" on public.services
  for select using (status = 'published');

create policy "courses public read published" on public.courses
  for select using (status = 'published');

create policy "jobs public read published" on public.jobs
  for select using (status = 'published');

create policy "team public read active" on public.team_members
  for select using (active = true);

create policy "testimonials public read published" on public.testimonials
  for select using (published = true);

create policy "faqs public read published" on public.faqs
  for select using (published = true);

create policy "clients public read active" on public.clients
  for select using (active = true);

create policy "partners public read active" on public.partners
  for select using (active = true);

create policy "menus public read" on public.menus
  for select using (true);

create policy "menu_items public read active" on public.menu_items
  for select using (active = true);

create policy "media public read" on public.media
  for select using (is_public = true);

create policy "seo_settings public read" on public.seo_settings
  for select using (true);

create policy "forms public read active" on public.forms
  for select using (status = 'active');

create policy "form_fields public read via active form" on public.form_fields
  for select using (
    exists (select 1 from public.forms f where f.id = form_id and f.status = 'active')
  );

-- =============================================================================
-- AUTHENTICATED ADMIN — full access via role
-- =============================================================================

create policy "profiles select own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles update own" on public.profiles
  for update using (id = auth.uid());

create policy "profiles insert own" on public.profiles
  for insert with check (id = auth.uid());

create policy "pages admin full" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

create policy "page_sections admin full" on public.page_sections
  for all using (public.is_admin()) with check (public.is_admin());

create policy "service_categories admin full" on public.service_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "course_categories admin full" on public.course_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "services admin full" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "courses admin full" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

create policy "jobs admin full" on public.jobs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "team admin full" on public.team_members
  for all using (public.is_admin()) with check (public.is_admin());

create policy "testimonials admin full" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

create policy "faqs admin full" on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "clients admin full" on public.clients
  for all using (public.is_admin()) with check (public.is_admin());

create policy "partners admin full" on public.partners
  for all using (public.is_admin()) with check (public.is_admin());

create policy "media admin full" on public.media
  for all using (public.is_admin()) with check (public.is_admin());

create policy "menus admin full" on public.menus
  for all using (public.is_admin()) with check (public.is_admin());

create policy "menu_items admin full" on public.menu_items
  for all using (public.is_admin()) with check (public.is_admin());

create policy "forms admin full" on public.forms
  for all using (public.is_admin()) with check (public.is_admin());

create policy "form_fields admin full" on public.form_fields
  for all using (public.is_admin()) with check (public.is_admin());

create policy "form_submissions admin full" on public.form_submissions
  for all using (public.is_admin()) with check (public.is_admin());

create policy "form_submission_values admin full" on public.form_submission_values
  for all using (public.is_admin()) with check (public.is_admin());

create policy "notifications admin full" on public.notifications
  for all using (public.is_admin()) with check (public.is_admin());

create policy "seo_settings admin full" on public.seo_settings
  for all using (public.is_admin()) with check (public.is_admin());

create policy "email_templates admin full" on public.email_templates
  for all using (public.is_admin()) with check (public.is_admin());

create policy "company_settings admin full" on public.company_settings
  for all using (public.is_admin()) with check (public.is_admin());

create policy "activity_logs admin read" on public.activity_logs
  for select using (public.is_admin());

create policy "audit_logs admin read" on public.audit_logs
  for select using (public.is_admin());

-- =============================================================================
-- SUPER ADMIN ONLY — sensitive configuration
-- =============================================================================

create policy "roles super admin only" on public.roles
  for all using (public.current_role() = 'super_admin') with check (public.current_role() = 'super_admin');

create policy "integrations super admin only" on public.integrations
  for all using (public.current_role() = 'super_admin') with check (public.current_role() = 'super_admin');

create policy "email_settings super admin only" on public.email_settings
  for all using (public.current_role() = 'super_admin') with check (public.current_role() = 'super_admin');

create policy "audit_logs insert any admin" on public.audit_logs
  for insert with check (public.is_admin());
