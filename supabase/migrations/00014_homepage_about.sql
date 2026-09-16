-- =============================================================================
-- 3DMCC — Migration: Homepage & About restructure
-- Moves Vision/Mission, Core Values, and Why-Choose from Homepage to About,
-- and turns the About overview into an image + text section.
-- =============================================================================

-- 1) Remove these sections from the homepage (content stays in the About page)
delete from public.page_sections
where page_id = 'e0000000-0000-0000-0000-000000000001'
  and type in ('vision_mission', 'core_values', 'features');

-- 2) Turn the About "Who We Are" overview into a two-column image + text section
update public.page_sections
set type = 'image_text',
    content = jsonb_build_object(
      'eyebrow_en', 'Company Overview',
      'eyebrow_ar', 'نظرة عامة',
      'title_en', 'Who We Are',
      'title_ar', 'من نحن',
      'text_en', '3DMCC is an innovative consulting firm founded in Jordan, specializing in management consultation and design services for private enterprises and individuals nationwide. The company originally started as a freelance initiative in 2017 and was formally incorporated in 2024. 3DMCC focuses on becoming a trusted strategic partner for clients by providing tailored solutions aligned with their unique needs and objectives.',
      'text_ar', '3DMCC شركة استشارية مبتكرة تأسست في الأردن، متخصصة في الاستشارات الإدارية وخدمات التصميم للشركات والأفراد في جميع أنحاء المملكة. بدأت الشركة كمبادرة عمل حر في عام 2017 وتم تأسيسها رسمياً في عام 2024. تركز 3DMCC على أن تكون شريكاً استراتيجياً موثوقاً لعملائها من خلال تقديم حلول مخصصة تتوافق مع احتياجاتهم وأهدافهم الفريدة.',
      'bullets_en', jsonb_build_array('Tailored solutions aligned with your objectives', 'Management, HR, finance, training, technology and design', 'Value-driven results and sustainable growth'),
      'bullets_ar', jsonb_build_array('حلول مخصصة تتوافق مع أهدافك', 'الإدارة والموارد البشرية والمالية والتدريب والتقنية والتصميم', 'نتائج قائمة على القيمة ونمو مستدام'),
      'image_position', 'right',
      'primary_label_en', 'Explore Our Services',
      'primary_label_ar', 'استكشف خدماتنا',
      'primary_url', '/services'
    )
where page_id = 'e0000000-0000-0000-0000-000000000002'
  and type = 'rich_text'
  and position = 2;

-- 3) Add the "Why Choose 3DMCC" features section to the About page
insert into public.page_sections (page_id, type, position, visibility, status, content)
values (
  'e0000000-0000-0000-0000-000000000002',
  'features',
  7,
  'visible',
  'published',
  '{
    "eyebrow_en": "Why Choose 3DMCC",
    "eyebrow_ar": "لماذا تختار 3DMCC",
    "title_en": "A partner, not just a provider",
    "title_ar": "شريك، وليس مجرد مزوّد خدمة",
    "subtitle_en": "We position ourselves as a strategic partner committed to your long-term success.",
    "subtitle_ar": "نضع أنفسنا كشريك استراتيجي ملتزم بنجاحك على المدى الطويل.",
    "items": [
      {"icon": "Puzzle", "title_en": "Tailored Consulting", "title_ar": "استشارات مخصصة", "text_en": "Solutions designed around each client''s needs.", "text_ar": "حلول مصممة حول احتياجات كل عميل."},
      {"icon": "Layers", "title_en": "Integrated Expertise", "title_ar": "خبرة متكاملة", "text_en": "Management, HR, finance, training, technology and design.", "text_ar": "الإدارة والموارد البشرية والمالية والتدريب والتقنية والتصميم."},
      {"icon": "HeartHandshake", "title_en": "Client-Centered Approach", "title_ar": "نهج يركز على العميل", "text_en": "Focus on measurable value and long-term relationships.", "text_ar": "التركيز على القيمة القابلة للقياس والعلاقات طويلة الأمد."},
      {"icon": "Workflow", "title_en": "Practical Solutions", "title_ar": "حلول عملية", "text_en": "Recommendations designed for real-world implementation.", "text_ar": "توصيات مصممة للتطبيق العملي الواقعي."},
      {"icon": "TrendingUp", "title_en": "Continuous Development", "title_ar": "تطوير مستمر", "text_en": "Commitment to learning, innovation and improvement.", "text_ar": "الالتزام بالتعلم والابتكار والتحسين."},
      {"icon": "Handshake", "title_en": "Long-Term Partnership", "title_ar": "شراكة طويلة الأمد", "text_en": "A strategic partner rather than a one-time provider.", "text_ar": "شريك استراتيجي بدلاً من مزوّد خدمة لمرة واحدة."}
    ]
  }'::jsonb
)
on conflict do nothing;
