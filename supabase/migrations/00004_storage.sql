-- =============================================================================
-- 3DMCC — Storage buckets & policies
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public', 'public', true, 10485760, null),
  ('private', 'private', false, 20971520, null)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Public bucket: anyone can read; admins can upload/manage
-- ---------------------------------------------------------------------------
create policy "public bucket read" on storage.objects
  for select using (bucket_id = 'public');

create policy "public bucket admin write" on storage.objects
  for insert with check (bucket_id = 'public' and public.is_admin());

create policy "public bucket admin update" on storage.objects
  for update using (bucket_id = 'public' and public.is_admin());

create policy "public bucket admin delete" on storage.objects
  for delete using (bucket_id = 'public' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Private bucket: no public access; admins full access
-- ---------------------------------------------------------------------------
create policy "private bucket admin read" on storage.objects
  for select using (bucket_id = 'private' and public.is_admin());

create policy "private bucket admin write" on storage.objects
  for insert with check (bucket_id = 'private' and public.is_admin());

create policy "private bucket admin update" on storage.objects
  for update using (bucket_id = 'private' and public.is_admin());

create policy "private bucket admin delete" on storage.objects
  for delete using (bucket_id = 'private' and public.is_admin());
