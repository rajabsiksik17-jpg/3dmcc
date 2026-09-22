-- =============================================================================
-- 3DMCC — Homepage: statistics bar + partners/clients logo sliders
-- =============================================================================

-- 1) Shift existing homepage sections down to make room for the stats bar
update public.page_sections
set position = position + 1
where page_id = 'e0000000-0000-0000-0000-000000000001'
  and position >= 2;

-- 2) Insert the statistics bar directly below the hero
insert into public.page_sections (page_id, type, position, visibility, status, content)
values (
  'e0000000-0000-0000-0000-000000000001',
  'stats',
  2,
  'visible',
  'published',
  '{
    "items": [
      {"value": 2024, "label_en": "Founded", "label_ar": "سنة التأسيس"},
      {"value": 15, "label_en": "Team Members", "label_ar": "عدد الموظفين"},
      {"value": 50, "label_en": "Companies Served", "label_ar": "عدد الشركات", "suffix": "+"},
      {"value": 120, "label_en": "Requests", "label_ar": "عدد الطلبات", "suffix": "+"}
    ]
  }'::jsonb
);

-- 3) Clients & partners logo sliders on the homepage
insert into public.page_sections (page_id, type, position, visibility, status, content) values
('e0000000-0000-0000-0000-000000000001', 'clients', 20, 'visible', 'published', '{
  "eyebrow_en": "Our Clients", "eyebrow_ar": "عملاؤنا",
  "title_en": "Trusted by leading organizations", "title_ar": "موثوقون من مؤسسات رائدة"
}'::jsonb),
('e0000000-0000-0000-0000-000000000001', 'partners', 21, 'visible', 'published', '{
  "eyebrow_en": "Our Partners", "eyebrow_ar": "شركاؤنا",
  "title_en": "Working together for success", "title_ar": "نعمل معاً من أجل النجاح"
}'::jsonb);

-- 4) Clients & partners logo sliders on the About page
insert into public.page_sections (page_id, type, position, visibility, status, content) values
('e0000000-0000-0000-0000-000000000002', 'clients', 20, 'visible', 'published', '{
  "eyebrow_en": "Our Clients", "eyebrow_ar": "عملاؤنا",
  "title_en": "Trusted by leading organizations", "title_ar": "موثوقون من مؤسسات رائدة"
}'::jsonb),
('e0000000-0000-0000-0000-000000000002', 'partners', 21, 'visible', 'published', '{
  "eyebrow_en": "Our Partners", "eyebrow_ar": "شركاؤنا",
  "title_en": "Working together for success", "title_ar": "نعمل معاً من أجل النجاح"
}'::jsonb);
