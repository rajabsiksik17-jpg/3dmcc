-- =============================================================================
-- 3DMCC — Migration: Course bilingual fields + delivery type normalization
-- =============================================================================

-- Bilingual duration
alter table public.courses
  add column if not exists duration_ar text;

-- Normalize delivery_type to translation keys
update public.courses set delivery_type = 'hybrid'   where delivery_type = 'In-person / Online';
update public.courses set delivery_type = 'in_person' where delivery_type = 'In-person';
update public.courses set delivery_type = 'online'    where delivery_type = 'Online';

-- Populate Arabic duration for seeded courses
update public.courses set duration_ar = '24 ساعة' where slug = 'practical-hrm-courses';
update public.courses set duration_ar = '20 ساعة' where slug = 'scientific-research-skills';
update public.courses set duration_ar = '30 ساعة' where slug = 'ai-programming-languages';
update public.courses set duration_ar = '25 ساعة' where slug = 'business-intelligence-data-analytics';
update public.courses set duration_ar = '18 ساعة' where slug = 'soft-skills-leadership';
