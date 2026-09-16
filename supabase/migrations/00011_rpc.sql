-- =============================================================================
-- 3DMCC — Public form submission RPC (security definer)
-- Public clients cannot INSERT directly; this function inserts submissions
-- safely after server-side validation.
-- =============================================================================

create or replace function public.submit_public_form(
  p_form_id uuid,
  p_form_type text,
  p_entity_type text,
  p_entity_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text,
  p_ip text,
  p_values jsonb
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_submission_id uuid;
  v_field record;
  v_allowed text[];
begin
  -- Ensure the form exists and is active
  if not exists (select 1 from public.forms where id = p_form_id and status = 'active') then
    raise exception 'Form is not active';
  end if;

  -- Build the list of allowed field names for this form
  select coalesce(array_agg(name), '{}') into v_allowed
  from public.form_fields
  where form_id = p_form_id;

  insert into public.form_submissions (form_id, form_type, entity_type, entity_id, customer_name, email, phone, ip_address, status)
  values (p_form_id, p_form_type, p_entity_type, p_entity_id, p_customer_name, p_email, p_phone, p_ip, 'new')
  returning id into v_submission_id;

  -- Insert only known fields (defense in depth against arbitrary keys)
  for v_field in
    select name, label_en from public.form_fields where form_id = p_form_id
  loop
    if p_values ? v_field.name then
      insert into public.form_submission_values (submission_id, field_name, field_label, value)
      values (v_submission_id, v_field.name, v_field.label_en, p_values -> v_field.name);
    end if;
  end loop;

  return v_submission_id;
end;
$$;

revoke all on function public.submit_public_form(uuid, text, text, uuid, text, text, text, text, jsonb) from public;
grant execute on function public.submit_public_form(uuid, text, text, uuid, text, text, text, text, jsonb) to anon, authenticated;
