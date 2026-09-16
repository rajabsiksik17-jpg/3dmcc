-- =============================================================================
-- 3DMCC — Seed: Pages & page sections (dynamic page builder)
-- =============================================================================

insert into public.pages (id, slug, title_en, title_ar, meta_title_en, meta_title_ar, meta_description_en, meta_description_ar, status) values
('e0000000-0000-0000-0000-000000000001', 'home', 'Home', 'الرئيسية', '3DMCC — Strategic Solutions. Sustainable Growth.', '3DMCC — حلول استراتيجية ونمو مستدام.', '3DMCC empowers organizations and professionals through integrated consulting and design services.', 'تمكّن 3DMCC المؤسسات والمهنيين من خلال خدمات استشارية وتصميمية متكاملة.', 'published'),
('e0000000-0000-0000-0000-000000000002', 'about', 'About Us', 'من نحن', 'About 3DMCC', 'عن 3DMCC', 'Learn about 3DMCC, an innovative consulting firm in Jordan.', 'تعرّف على 3DMCC، شركة استشارية مبتكرة في الأردن.', 'published'),
('e0000000-0000-0000-0000-000000000003', 'services', 'Services', 'خدماتنا', 'Our Services — 3DMCC', 'خدماتنا — 3DMCC', 'Integrated consulting and design services tailored to your needs.', 'خدمات استشارية وتصميمية متكاملة مصممة وفق احتياجاتك.', 'published'),
('e0000000-0000-0000-0000-000000000004', 'courses', 'Courses', 'الدورات', 'Training & Development — 3DMCC', 'التدريب والتطوير — 3DMCC', 'Practical, career-focused courses designed to build real-world skills.', 'دورات عملية ومركزة على المسار المهني لبناء مهارات حقيقية.', 'published'),
('e0000000-0000-0000-0000-000000000005', 'careers', 'Careers', 'الوظائف', 'Careers — 3DMCC', 'الوظائف — 3DMCC', 'Join a team committed to value-driven consulting and continuous development.', 'انضم إلى فريق ملتزم بالاستشارات القائمة على القيمة والتطوير المستمر.', 'published'),
('e0000000-0000-0000-0000-000000000006', 'contact', 'Contact Us', 'اتصل بنا', 'Contact Us — 3DMCC', 'اتصل بنا — 3DMCC', 'Get in touch with 3DMCC.', 'تواصل مع 3DMCC.', 'published'),
('e0000000-0000-0000-0000-000000000007', 'privacy-policy', 'Privacy Policy', 'سياسة الخصوصية', 'Privacy Policy — 3DMCC', 'سياسة الخصوصية — 3DMCC', 'Privacy policy for the 3DMCC website.', 'سياسة الخصوصية لموقع 3DMCC.', 'published'),
('e0000000-0000-0000-0000-000000000008', 'terms', 'Terms & Conditions', 'الشروط والأحكام', 'Terms & Conditions — 3DMCC', 'الشروط والأحكام — 3DMCC', 'Terms and conditions for using the 3DMCC website.', 'الشروط والأحكام لاستخدام موقع 3DMCC.', 'published')
on conflict (slug) do nothing;

-- =============================================================================
-- Homepage sections
-- =============================================================================

insert into public.page_sections (page_id, type, position, visibility, status, content) values

('e0000000-0000-0000-0000-000000000001', 'hero', 1, 'visible', 'published', '{
  "badge_en": "Management Consulting & Design",
  "badge_ar": "استشارات إدارية وتصميم",
  "title_en": "Strategic Solutions. Sustainable Growth.",
  "title_ar": "حلول استراتيجية. نمو مستدام.",
  "subtitle_en": "3DMCC empowers organizations and professionals through integrated management consulting, HR solutions, business advisory, training, and design services.",
  "subtitle_ar": "تمكّن 3DMCC المؤسسات والمهنيين من خلال خدمات متكاملة في الاستشارات الإدارية وحلول الموارد البشرية واستشارات الأعمال والتدريب والتصميم.",
  "primary_label_en": "Explore Our Services",
  "primary_label_ar": "استكشف خدماتنا",
  "primary_url": "/services",
  "secondary_label_en": "Talk to Our Experts",
  "secondary_label_ar": "تحدث إلى خبرائنا",
  "secondary_url": "/contact"
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'image_text', 2, 'visible', 'published', '{
  "eyebrow_en": "Trusted Strategic Partner",
  "eyebrow_ar": "شريكك الاستراتيجي الموثوق",
  "title_en": "Consulting built around your goals",
  "title_ar": "استشارات مبنية حول أهدافك",
  "text_en": "3DMCC is an innovative consulting firm founded in Jordan, specializing in management consultation and design services for private enterprises and individuals nationwide. We combine industry knowledge with a client-centered approach to deliver value-driven results and support sustainable growth.",
  "text_ar": "3DMCC شركة استشارية مبتكرة تأسست في الأردن، متخصصة في الاستشارات الإدارية وخدمات التصميم للشركات والأفراد في جميع أنحاء المملكة. نجمع بين المعرفة القطاعية والنهج الذي يركز على العميل لتقديم نتائج قائمة على القيمة ودعم النمو المستدام.",
  "bullets_en": ["Tailored solutions aligned with your objectives", "Management, HR, finance, training, technology and design", "Value-driven results and sustainable growth"],
  "bullets_ar": ["حلول مخصصة تتوافق مع أهدافك", "الإدارة والموارد البشرية والمالية والتدريب والتقنية والتصميم", "نتائج قائمة على القيمة ونمو مستدام"],
  "image_position": "right",
  "primary_label_en": "Learn About 3DMCC",
  "primary_label_ar": "تعرّف على 3DMCC",
  "primary_url": "/about"
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'services_grid', 3, 'visible', 'published', '{
  "eyebrow_en": "What We Do",
  "eyebrow_ar": "ماذا نقدم",
  "title_en": "Core Services",
  "title_ar": "خدماتنا الأساسية",
  "subtitle_en": "Integrated consulting and design services tailored to your organization''s needs.",
  "subtitle_ar": "خدمات استشارية وتصميمية متكاملة مصممة وفق احتياجات مؤسستك.",
  "limit": 6,
  "show_all_url": "/services"
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'features', 4, 'visible', 'published', '{
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
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'approach', 5, 'visible', 'published', '{
  "eyebrow_en": "Our Approach",
  "eyebrow_ar": "منهجيتنا",
  "title_en": "A proven consulting methodology",
  "title_ar": "منهجية استشارية مجرّبة",
  "subtitle_en": "We follow a structured approach to deliver measurable, sustainable results.",
  "subtitle_ar": "نتّبع منهجية منظمة لتحقيق نتائج قابلة للقياس ومستدامة.",
  "items": [
    {"icon": "Search", "title_en": "Understand", "title_ar": "الفهم", "text_en": "Understand the organization''s challenges and objectives.", "text_ar": "فهم تحديات المؤسسة وأهدافها."},
    {"icon": "BarChart3", "title_en": "Analyze", "title_ar": "التحليل", "text_en": "Analyze current processes, capabilities and opportunities.", "text_ar": "تحليل العمليات والقدرات والفرص الحالية."},
    {"icon": "Compass", "title_en": "Strategize", "title_ar": "وضع الاستراتيجية", "text_en": "Develop a practical strategy aligned with business objectives.", "text_ar": "تطوير استراتيجية عملية متوافقة مع أهداف العمل."},
    {"icon": "Rocket", "title_en": "Implement", "title_ar": "التنفيذ", "text_en": "Support implementation and operational execution.", "text_ar": "دعم التنفيذ والتشغيل."},
    {"icon": "Gauge", "title_en": "Measure", "title_ar": "القياس", "text_en": "Track progress and identify areas for improvement.", "text_ar": "تتبع التقدم وتحديد مجالات التحسين."},
    {"icon": "RefreshCw", "title_en": "Improve", "title_ar": "التحسين", "text_en": "Continuously optimize results.", "text_ar": "تحسين النتائج باستمرار."}
  ]
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'vision_mission', 6, 'visible', 'published', '{
  "eyebrow_en": "Vision & Mission",
  "eyebrow_ar": "الرؤية والرسالة",
  "title_en": "Where we are heading",
  "title_ar": "إلى أين نتجه",
  "vision_en": "To become a leading provider of management consulting and design services in the Middle East and GCC region.",
  "vision_ar": "أن نصبح مزوّداً رائداً لخدمات الاستشارات الإدارية والتصميم في منطقة الشرق الأوسط والخليج.",
  "mission_en": "To empower companies and individuals by delivering exceptional design and management consulting services, fostering collaboration to create and provide integrated solutions that benefit the local community and the wider region.",
  "mission_ar": "تمكين الشركات والأفراد من خلال تقديم خدمات استشارية وتصميمية استثنائية، وتعزيز التعاون لإنشاء وتوفير حلول متكاملة تعود بالنفع على المجتمع المحلي والمنطقة الأوسع."
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'core_values', 7, 'visible', 'published', '{
  "eyebrow_en": "Core Values",
  "eyebrow_ar": "قيمنا الأساسية",
  "title_en": "The principles that guide us",
  "title_ar": "المبادئ التي توجّهنا",
  "items": [
    {"icon": "Scale", "title_en": "Win-Win Principle", "title_ar": "مبدأ المكسب للطرفين", "text_en": "We pursue outcomes that benefit everyone involved.", "text_ar": "نسعى لنتائج تعود بالنفع على جميع الأطراف."},
    {"icon": "ShieldCheck", "title_en": "Integrity in All Interactions", "title_ar": "النزاهة في جميع التعاملات", "text_en": "We act with honesty and transparency.", "text_ar": "نتعامل بأمانة وشفافية."},
    {"icon": "ClipboardCheck", "title_en": "Accountability and Commitment", "title_ar": "المساءلة والالتزام", "text_en": "We take responsibility for our work and results.", "text_ar": "نتحمل مسؤولية عملنا ونتائجنا."},
    {"icon": "BookMarked", "title_en": "Strong Ethical Foundations", "title_ar": "أسس أخلاقية راسخة", "text_en": "Ethics are at the core of everything we do.", "text_ar": "الأخلاق في صميم كل ما نقوم به."},
    {"icon": "Sparkles", "title_en": "Continuous Improvement & Learning", "title_ar": "التحسين والتعلم المستمر", "text_en": "We keep learning and improving.", "text_ar": "نواصل التعلم والتحسين."}
  ]
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'courses_grid', 8, 'visible', 'published', '{
  "eyebrow_en": "Training & Development",
  "eyebrow_ar": "التدريب والتطوير",
  "title_en": "Featured Courses",
  "title_ar": "دورات مميزة",
  "subtitle_en": "Practical, career-focused courses designed to build real-world skills.",
  "subtitle_ar": "دورات عملية ومركزة على المسار المهني لبناء مهارات حقيقية.",
  "limit": 4,
  "show_all_url": "/courses"
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'cta', 9, 'visible', 'published', '{
  "title_en": "Need Expert Guidance?",
  "title_ar": "هل تحتاج إلى إرشاد خبير؟",
  "text_en": "Let''s discuss how 3DMCC can support your organization.",
  "text_ar": "دعنا نناقش كيف يمكن لـ 3DMCC دعم مؤسستك.",
  "primary_label_en": "Contact Us",
  "primary_label_ar": "اتصل بنا",
  "primary_url": "/contact",
  "secondary_label_en": "Explore Services",
  "secondary_label_ar": "استكشف الخدمات",
  "secondary_url": "/services"
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'faq', 10, 'visible', 'published', '{
  "eyebrow_en": "FAQ",
  "eyebrow_ar": "الأسئلة الشائعة",
  "title_en": "Frequently Asked Questions",
  "title_ar": "الأسئلة الشائعة",
  "subtitle_en": "Quick answers to common questions about 3DMCC.",
  "subtitle_ar": "إجابات سريعة عن الأسئلة الشائعة حول 3DMCC."
}'::jsonb),

('e0000000-0000-0000-0000-000000000001', 'contact', 11, 'visible', 'published', '{
  "eyebrow_en": "Get In Touch",
  "eyebrow_ar": "تواصل معنا",
  "title_en": "Contact 3DMCC",
  "title_ar": "اتصل بـ 3DMCC",
  "subtitle_en": "Reach out and let''s discuss how we can help.",
  "subtitle_ar": "تواصل معنا ودعنا نناقش كيف يمكننا المساعدة."
}'::jsonb);

-- =============================================================================
-- About page sections
-- =============================================================================

insert into public.page_sections (page_id, type, position, visibility, status, content) values

('e0000000-0000-0000-0000-000000000002', 'hero', 1, 'visible', 'published', '{
  "badge_en": "Who We Are",
  "badge_ar": "من نحن",
  "title_en": "About 3DMCC",
  "title_ar": "عن 3DMCC",
  "subtitle_en": "An innovative consulting firm founded in Jordan, specializing in management consultation and design services.",
  "subtitle_ar": "شركة استشارية مبتكرة تأسست في الأردن، متخصصة في الاستشارات الإدارية وخدمات التصميم.",
  "primary_label_en": "Explore Our Services",
  "primary_label_ar": "استكشف خدماتنا",
  "primary_url": "/services",
  "secondary_label_en": "Contact Us",
  "secondary_label_ar": "اتصل بنا",
  "secondary_url": "/contact"
}'::jsonb),

('e0000000-0000-0000-0000-000000000002', 'rich_text', 2, 'visible', 'published', '{
  "eyebrow_en": "Company Overview",
  "eyebrow_ar": "نظرة عامة",
  "title_en": "Who We Are",
  "title_ar": "من نحن",
  "content_en": "3DMCC is an innovative consulting firm founded in Jordan, specializing in management consultation and design services for private enterprises and individuals nationwide. The company originally started as a freelance initiative in 2017 and was formally incorporated in 2024. 3DMCC focuses on becoming a trusted strategic partner for clients by providing tailored solutions aligned with their unique needs and objectives. The company combines industry knowledge with a client-centered approach to deliver value-driven results and support sustainable growth.",
  "content_ar": "3DMCC شركة استشارية مبتكرة تأسست في الأردن، متخصصة في الاستشارات الإدارية وخدمات التصميم للشركات والأفراد في جميع أنحاء المملكة. بدأت الشركة كمبادرة عمل حر في عام 2017 وتم تأسيسها رسمياً في عام 2024. تركز 3DMCC على أن تكون شريكاً استراتيجياً موثوقاً لعملائها من خلال تقديم حلول مخصصة تتوافق مع احتياجاتهم وأهدافهم الفريدة. تجمع الشركة بين المعرفة القطاعية والنهج الذي يركز على العميل لتقديم نتائج قائمة على القيمة ودعم النمو المستدام."
}'::jsonb),

('e0000000-0000-0000-0000-000000000002', 'timeline', 3, 'visible', 'published', '{
  "eyebrow_en": "Our Journey",
  "eyebrow_ar": "رحلتنا",
  "title_en": "From freelance to a trusted partner",
  "title_ar": "من العمل الحر إلى شريك موثوق",
  "items": [
    {"year": "2017", "title_en": "Freelance Initiative", "title_ar": "مبادرة عمل حر", "text_en": "3DMCC begins as a freelance consulting initiative.", "text_ar": "بدأت 3DMCC كمبادرة استشارية حرة."},
    {"year": "2024", "title_en": "Formal Incorporation", "title_ar": "التأسيس الرسمي", "text_en": "The company is formally incorporated as 3D for Management Consulting Company.", "text_ar": "تأسست الشركة رسمياً باسم 3D للاستشارات الإدارية."},
    {"year": "Future", "title_en": "Regional Growth", "title_ar": "نمو إقليمي", "text_en": "Expanding across MENA & GCC as a leading consulting provider.", "text_ar": "التوسع عبر الشرق الأوسط والخليج كمزوّد استشاري رائد."}
  ]
}'::jsonb),

('e0000000-0000-0000-0000-000000000002', 'vision_mission', 4, 'visible', 'published', '{
  "eyebrow_en": "Vision & Mission",
  "eyebrow_ar": "الرؤية والرسالة",
  "title_en": "Our direction and purpose",
  "title_ar": "اتجاهنا وهدفنا",
  "vision_en": "To become a leading provider of management consulting and design services in the Middle East and GCC region.",
  "vision_ar": "أن نصبح مزوّداً رائداً لخدمات الاستشارات الإدارية والتصميم في منطقة الشرق الأوسط والخليج.",
  "mission_en": "To empower companies and individuals by delivering exceptional design and management consulting services, fostering collaboration to create and provide integrated solutions that benefit the local community and the wider region.",
  "mission_ar": "تمكين الشركات والأفراد من خلال تقديم خدمات استشارية وتصميمية استثنائية، وتعزيز التعاون لإنشاء وتوفير حلول متكاملة تعود بالنفع على المجتمع المحلي والمنطقة الأوسع."
}'::jsonb),

('e0000000-0000-0000-0000-000000000002', 'core_values', 5, 'visible', 'published', '{
  "eyebrow_en": "Core Values",
  "eyebrow_ar": "قيمنا الأساسية",
  "title_en": "The principles that guide us",
  "title_ar": "المبادئ التي توجّهنا",
  "items": [
    {"icon": "Scale", "title_en": "Win-Win Principle", "title_ar": "مبدأ المكسب للطرفين", "text_en": "We pursue outcomes that benefit everyone involved.", "text_ar": "نسعى لنتائج تعود بالنفع على جميع الأطراف."},
    {"icon": "ShieldCheck", "title_en": "Integrity in All Interactions", "title_ar": "النزاهة في جميع التعاملات", "text_en": "We act with honesty and transparency.", "text_ar": "نتعامل بأمانة وشفافية."},
    {"icon": "ClipboardCheck", "title_en": "Accountability and Commitment", "title_ar": "المساءلة والالتزام", "text_en": "We take responsibility for our work and results.", "text_ar": "نتحمل مسؤولية عملنا ونتائجنا."},
    {"icon": "BookMarked", "title_en": "Strong Ethical Foundations", "title_ar": "أسس أخلاقية راسخة", "text_en": "Ethics are at the core of everything we do.", "text_ar": "الأخلاق في صميم كل ما نقوم به."},
    {"icon": "Sparkles", "title_en": "Continuous Improvement & Learning", "title_ar": "التحسين والتعلم المستمر", "text_en": "We keep learning and improving.", "text_ar": "نواصل التعلم والتحسين."}
  ]
}'::jsonb),

('e0000000-0000-0000-0000-000000000002', 'approach', 6, 'visible', 'published', '{
  "eyebrow_en": "Our Approach",
  "eyebrow_ar": "منهجيتنا",
  "title_en": "A proven consulting methodology",
  "title_ar": "منهجية استشارية مجرّبة",
  "subtitle_en": "We follow a structured approach to deliver measurable, sustainable results.",
  "subtitle_ar": "نتّبع منهجية منظمة لتحقيق نتائج قابلة للقياس ومستدامة.",
  "items": [
    {"icon": "Search", "title_en": "Understand", "title_ar": "الفهم", "text_en": "Understand the organization''s challenges and objectives.", "text_ar": "فهم تحديات المؤسسة وأهدافها."},
    {"icon": "BarChart3", "title_en": "Analyze", "title_ar": "التحليل", "text_en": "Analyze current processes, capabilities and opportunities.", "text_ar": "تحليل العمليات والقدرات والفرص الحالية."},
    {"icon": "Compass", "title_en": "Strategize", "title_ar": "وضع الاستراتيجية", "text_en": "Develop a practical strategy aligned with business objectives.", "text_ar": "تطوير استراتيجية عملية متوافقة مع أهداف العمل."},
    {"icon": "Rocket", "title_en": "Implement", "title_ar": "التنفيذ", "text_en": "Support implementation and operational execution.", "text_ar": "دعم التنفيذ والتشغيل."},
    {"icon": "Gauge", "title_en": "Measure", "title_ar": "القياس", "text_en": "Track progress and identify areas for improvement.", "text_ar": "تتبع التقدم وتحديد مجالات التحسين."},
    {"icon": "RefreshCw", "title_en": "Improve", "title_ar": "التحسين", "text_en": "Continuously optimize results.", "text_ar": "تحسين النتائج باستمرار."}
  ]
}'::jsonb),

('e0000000-0000-0000-0000-000000000002', 'cta', 7, 'visible', 'published', '{
  "title_en": "Need Expert Guidance?",
  "title_ar": "هل تحتاج إلى إرشاد خبير؟",
  "text_en": "Let''s discuss how 3DMCC can support your organization.",
  "text_ar": "دعنا نناقش كيف يمكن لـ 3DMCC دعم مؤسستك.",
  "primary_label_en": "Contact Us",
  "primary_label_ar": "اتصل بنا",
  "primary_url": "/contact",
  "secondary_label_en": "Explore Services",
  "secondary_label_ar": "استكشف الخدمات",
  "secondary_url": "/services"
}'::jsonb);

-- =============================================================================
-- Other pages — hero sections
-- =============================================================================

insert into public.page_sections (page_id, type, position, visibility, status, content) values
('e0000000-0000-0000-0000-000000000003', 'hero', 1, 'visible', 'published', '{
  "badge_en": "What We Do", "badge_ar": "ماذا نقدم",
  "title_en": "Our Services", "title_ar": "خدماتنا",
  "subtitle_en": "Integrated consulting and design services tailored to your organization''s needs.",
  "subtitle_ar": "خدمات استشارية وتصميمية متكاملة مصممة وفق احتياجات مؤسستك."
}'::jsonb),
('e0000000-0000-0000-0000-000000000004', 'hero', 1, 'visible', 'published', '{
  "badge_en": "Training & Development", "badge_ar": "التدريب والتطوير",
  "title_en": "Our Courses", "title_ar": "دوراتنا",
  "subtitle_en": "Practical, career-focused courses designed to build real-world skills.",
  "subtitle_ar": "دورات عملية ومركزة على المسار المهني لبناء مهارات حقيقية."
}'::jsonb),
('e0000000-0000-0000-0000-000000000005', 'hero', 1, 'visible', 'published', '{
  "badge_en": "Join Our Team", "badge_ar": "انضم إلى فريقنا",
  "title_en": "Careers at 3DMCC", "title_ar": "الوظائف في 3DMCC",
  "subtitle_en": "Join a team committed to value-driven consulting and continuous development.",
  "subtitle_ar": "انضم إلى فريق ملتزم بالاستشارات القائمة على القيمة والتطوير المستمر."
}'::jsonb),
('e0000000-0000-0000-0000-000000000006', 'hero', 1, 'visible', 'published', '{
  "badge_en": "Get In Touch", "badge_ar": "تواصل معنا",
  "title_en": "Contact Us", "title_ar": "اتصل بنا",
  "subtitle_en": "We''d love to hear from you. Reach out and let''s discuss how we can help.",
  "subtitle_ar": "يسعدنا تواصلك معنا. دعنا نناقش كيف يمكننا مساعدتك."
}'::jsonb);
