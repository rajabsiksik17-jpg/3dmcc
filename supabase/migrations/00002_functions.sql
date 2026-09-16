-- =============================================================================
-- 3DMCC — Functions & triggers
-- =============================================================================

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.trigger_updated_at(target_table regclass)
returns void
language plpgsql
as $$
declare
  t text := target_table::text;
begin
  execute format(
    'create trigger trg_%s_updated_at before update on %I for each row execute procedure public.set_updated_at()',
    replace(t, '.', '_'), target_table
  );
end;
$$;

select public.trigger_updated_at('public.company_settings');
select public.trigger_updated_at('public.pages');
select public.trigger_updated_at('public.page_sections');
select public.trigger_updated_at('public.services');
select public.trigger_updated_at('public.courses');
select public.trigger_updated_at('public.jobs');
select public.trigger_updated_at('public.forms');
select public.trigger_updated_at('public.form_submissions');
select public.trigger_updated_at('public.profiles');
select public.trigger_updated_at('public.email_templates');
select public.trigger_updated_at('public.integrations');
select public.trigger_updated_at('public.seo_settings');
select public.trigger_updated_at('public.email_settings');

-- ---------------------------------------------------------------------------
-- Handle new user signup -> create profile
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'content_manager')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RBAC helpers (security definer)
-- ---------------------------------------------------------------------------
create or replace function public.current_role()
returns text
language sql
stable
security definer set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), '');
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin','admin','editor','hr_manager','content_manager')
  );
$$;

create or replace function public.has_permission(perm text)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.roles r on r.name = p.role
    where p.id = auth.uid()
      and (
        r.name = 'super_admin'
        or r.permissions ? perm
      )
  );
$$;

-- ---------------------------------------------------------------------------
-- Notification on new submission
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_submission()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_type text;
  v_title_en text;
  v_title_ar text;
begin
  v_type := case
    when new.form_type = 'contact' then 'contact'
    when new.form_type = 'service' then 'service_inquiry'
    when new.form_type = 'career' then 'job_application'
    when new.form_type = 'course' then 'course_registration'
    else 'form_submission'
  end;

  v_title_en := case
    when new.form_type = 'contact' then 'New contact message'
    when new.form_type = 'service' then 'New service request'
    when new.form_type = 'career' then 'New job application'
    when new.form_type = 'course' then 'New course registration'
    else 'New form submission'
  end;

  v_title_ar := case
    when new.form_type = 'contact' then 'رسالة تواصل جديدة'
    when new.form_type = 'service' then 'طلب خدمة جديد'
    when new.form_type = 'career' then 'طلب وظيفة جديد'
    when new.form_type = 'course' then 'تسجيل دورة جديد'
    else 'إرسال نموذج جديد'
  end;

  insert into public.notifications (type, title_en, title_ar, body_en, body_ar, entity_type, entity_id)
  values (
    v_type,
    v_title_en,
    v_title_ar,
    coalesce(new.customer_name, new.email, ''),
    coalesce(new.customer_name, new.email, ''),
    'form_submission',
    new.id
  );

  return new;
end;
$$;

drop trigger if exists on_form_submission_created on public.form_submissions;
create trigger on_form_submission_created
  after insert on public.form_submissions
  for each row execute procedure public.handle_new_submission();

-- ---------------------------------------------------------------------------
-- Activity log helper
-- ---------------------------------------------------------------------------
create or replace function public.log_activity(
  p_action text,
  p_entity text default null,
  p_entity_id uuid default null,
  p_metadata jsonb default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.activity_logs (user_id, action, entity, entity_id, metadata)
  values (auth.uid(), p_action, p_entity, p_entity_id, p_metadata);
end;
$$;
