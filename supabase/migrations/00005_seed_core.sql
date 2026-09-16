-- =============================================================================
-- 3DMCC — Seed: roles, company, categories, SEO, email templates, menus
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
insert into public.roles (id, name, permissions) values
  (gen_random_uuid(), 'super_admin', '[]'::jsonb),
  (gen_random_uuid(), 'admin', '["pages.view","pages.create","pages.update","pages.delete","services.view","services.create","services.update","services.delete","courses.view","courses.create","courses.update","courses.delete","jobs.view","jobs.create","jobs.update","jobs.delete","applications.view","applications.update","forms.view","forms.update","media.view","media.manage","notifications.manage","settings.manage"]'::jsonb),
  (gen_random_uuid(), 'editor', '["pages.view","pages.create","pages.update","services.view","services.create","services.update","courses.view","courses.create","courses.update","jobs.view","jobs.create","jobs.update","media.view","media.manage"]'::jsonb),
  (gen_random_uuid(), 'hr_manager', '["jobs.view","jobs.create","jobs.update","applications.view","applications.update","team.manage","notifications.manage"]'::jsonb),
  (gen_random_uuid(), 'content_manager', '["pages.view","pages.update","services.view","services.update","courses.view","courses.update","jobs.view","media.view","media.manage"]'::jsonb)
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Company settings (single row)
-- ---------------------------------------------------------------------------
insert into public.company_settings (
  id, name_en, name_ar,
  short_description_en, short_description_ar,
  full_description_en, full_description_ar,
  phone, whatsapp, email, website,
  address_en, address_ar, city_en, city_ar, country_en, country_ar,
  working_hours_en, working_hours_ar
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '3DMCC', '3DMCC',
  '3D for Management Consulting Company',
  '3D للاستشارات الإدارية',
  '3DMCC is an innovative consulting firm founded in Jordan, specializing in management consultation and design services for private enterprises and individuals nationwide. The company originally started as a freelance initiative in 2017 and was formally incorporated in 2024. 3DMCC focuses on becoming a trusted strategic partner for clients by providing tailored solutions aligned with their unique needs and objectives.',
  '3DMCC شركة استشارية مبتكرة تأسست في الأردن، متخصصة في الاستشارات الإدارية وخدمات التصميم للشركات والأفراد في جميع أنحاء المملكة. بدأت الشركة كمبادرة عمل حر في عام 2017 وتم تأسيسها رسمياً في عام 2024. تركز 3DMCC على أن تكون شريكاً استراتيجياً موثوقاً لعملائها من خلال تقديم حلول مخصصة تتوافق مع احتياجاتهم وأهدافهم الفريدة.',
  '+962 7 9237 9011', '+962 7 9237 9011', 'info@3dmcc.net', 'https://3dmcc.net',
  'Amman, Jordan', 'عمّان، الأردن',
  'Amman', 'عمّان', 'Jordan', 'الأردن',
  'Sunday – Thursday: 9:00 AM – 6:00 PM',
  'الأحد – الخميس: 9:00 صباحاً – 6:00 مساءً'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Service categories
-- ---------------------------------------------------------------------------
insert into public.service_categories (id, name_en, name_ar, slug, sort_order) values
  ('b0000000-0000-0000-0000-000000000001', 'Management Consulting', 'الاستشارات الإدارية', 'management-consulting', 1),
  ('b0000000-0000-0000-0000-000000000002', 'Design & Architecture', 'التصميم والعمارة', 'design-architecture', 2)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Course categories
-- ---------------------------------------------------------------------------
insert into public.course_categories (id, name_en, name_ar, slug, sort_order) values
  ('c0000000-0000-0000-0000-000000000001', 'Human Resources', 'الموارد البشرية', 'human-resources', 1),
  ('c0000000-0000-0000-0000-000000000002', 'Scientific Research', 'البحث العلمي', 'scientific-research', 2),
  ('c0000000-0000-0000-0000-000000000003', 'AI & Programming', 'الذكاء الاصطناعي والبرمجة', 'ai-programming', 3),
  ('c0000000-0000-0000-0000-000000000004', 'Business Intelligence & Data Analytics', 'ذكاء الأعمال وتحليل البيانات', 'bi-data-analytics', 4),
  ('c0000000-0000-0000-0000-000000000005', 'Soft Skills & Leadership', 'المهارات الناعمة والقيادة', 'soft-skills-leadership', 5)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- SEO settings (defaults per page)
-- ---------------------------------------------------------------------------
insert into public.seo_settings (page_key, title_en, title_ar, description_en, description_ar, keywords, robots) values
  ('home', '3DMCC — Strategic Solutions. Sustainable Growth.', '3DMCC — حلول استراتيجية ونمو مستدام.', '3DMCC empowers organizations and professionals through integrated management consulting, HR solutions, business advisory, training, and design services.', 'تمكّن 3DMCC المؤسسات والمهنيين من خلال خدمات متكاملة في الاستشارات الإدارية وحلول الموارد البشرية واستشارات الأعمال والتدريب والتصميم.', 'management consulting, HR consulting, training, Jordan, architecture design', 'index, follow'),
  ('about', 'About 3DMCC — 3D for Management Consulting Company', 'عن 3DMCC — 3D للاستشارات الإدارية', 'Learn about 3DMCC, an innovative consulting firm in Jordan specializing in management consultation and design services.', 'تعرّف على 3DMCC، شركة استشارية مبتكرة في الأردن متخصصة في الاستشارات الإدارية وخدمات التصميم.', 'about 3DMCC, consulting firm Jordan', 'index, follow'),
  ('services', 'Our Services — 3DMCC', 'خدماتنا — 3DMCC', 'Integrated consulting and design services tailored to your organization''s needs.', 'خدمات استشارية وتصميمية متكاملة مصممة وفق احتياجات مؤسستك.', 'management consulting, HR outsourcing, payroll, ISO, architecture', 'index, follow'),
  ('courses', 'Training & Development — 3DMCC', 'التدريب والتطوير — 3DMCC', 'Practical, career-focused courses designed to build real-world skills.', 'دورات عملية ومركزة على المسار المهني لبناء مهارات حقيقية.', 'HR courses, AI courses, data analytics training', 'index, follow'),
  ('careers', 'Careers — 3DMCC', 'الوظائف — 3DMCC', 'Join a team committed to value-driven consulting and continuous development.', 'انضم إلى فريق ملتزم بالاستشارات القائمة على القيمة والتطوير المستمر.', 'careers, jobs, 3DMCC', 'index, follow'),
  ('contact', 'Contact Us — 3DMCC', 'اتصل بنا — 3DMCC', 'Get in touch with 3DMCC. We would love to hear from you.', 'تواصل مع 3DMCC. يسعدنا أن نسمع منك.', 'contact 3DMCC', 'index, follow')
on conflict (page_key) do nothing;

-- ---------------------------------------------------------------------------
-- Email templates
-- ---------------------------------------------------------------------------
insert into public.email_templates (key, subject_en, subject_ar, body_en, body_ar) values
  ('contact_received', 'Thank you for contacting 3DMCC', 'شكراً لتواصلك مع 3DMCC', 'Hello {{name}},\n\nThank you for reaching out to 3DMCC. We have received your message and will get back to you shortly.\n\nBest regards,\n3DMCC Team', 'مرحباً {{name}}،\n\nشكراً لتواصلك مع 3DMCC. لقد استلمنا رسالتك وسنرد عليك قريباً.\n\nمع أطيب التحيات،\nفريق 3DMCC'),
  ('service_request_received', 'Your service request has been received', 'تم استلام طلب الخدمة الخاص بك', 'Hello {{name}},\n\nWe have received your request for {{service}}. Our team will contact you shortly.\n\nBest regards,\n3DMCC Team', 'مرحباً {{name}}،\n\nلقد استلمنا طلبك بخصوص {{service}}. سيتواصل معك فريقنا قريباً.\n\nمع أطيب التحيات،\nفريق 3DMCC'),
  ('job_application_received', 'Application received — 3DMCC', 'تم استلام طلب التقديم — 3DMCC', 'Hello {{name}},\n\nThank you for applying to {{job}}. We will review your application and contact you if there is a match.\n\nBest regards,\n3DMCC Team', 'مرحباً {{name}}،\n\nشكراً لتقديمك على وظيفة {{job}}. سنراجع طلبك وسنتواصل معك في حال وجود تطابق.\n\nمع أطيب التحيات،\nفريق 3DMCC'),
  ('course_registration_received', 'Course registration received — 3DMCC', 'تم استلام تسجيل الدورة — 3DMCC', 'Hello {{name}},\n\nThank you for registering for {{course}}. We will contact you with further details.\n\nBest regards,\n3DMCC Team', 'مرحباً {{name}}،\n\nشكراً لتسجيلك في دورة {{course}}. سوف نتواصل معك بمزيد من التفاصيل.\n\nمع أطيب التحيات،\nفريق 3DMCC'),
  ('admin_notification', 'New submission received', 'استلام إرسال جديد', 'A new submission has been received.\n\nType: {{type}}\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}', 'تم استلام إرسال جديد.\n\nالنوع: {{type}}\nالاسم: {{name}}\nالبريد الإلكتروني: {{email}}\nالهاتف: {{phone}}')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Menus
-- ---------------------------------------------------------------------------
insert into public.menus (id, name, location) values
  ('d0000000-0000-0000-0000-000000000001', 'Header', 'header'),
  ('d0000000-0000-0000-0000-000000000002', 'Footer', 'footer')
on conflict (location) do nothing;

insert into public.menu_items (menu_id, label_en, label_ar, url, sort_order, active, target) values
  ('d0000000-0000-0000-0000-000000000001', 'Home', 'الرئيسية', '/', 1, true, '_self'),
  ('d0000000-0000-0000-0000-000000000001', 'About', 'من نحن', '/about', 2, true, '_self'),
  ('d0000000-0000-0000-0000-000000000001', 'Services', 'خدماتنا', '/services', 3, true, '_self'),
  ('d0000000-0000-0000-0000-000000000001', 'Courses', 'الدورات', '/courses', 4, true, '_self'),
  ('d0000000-0000-0000-0000-000000000001', 'Careers', 'الوظائف', '/careers', 5, true, '_self'),
  ('d0000000-0000-0000-0000-000000000001', 'Contact', 'اتصل بنا', '/contact', 6, true, '_self'),
  ('d0000000-0000-0000-0000-000000000002', 'About Us', 'من نحن', '/about', 1, true, '_self'),
  ('d0000000-0000-0000-0000-000000000002', 'Services', 'خدماتنا', '/services', 2, true, '_self'),
  ('d0000000-0000-0000-0000-000000000002', 'Courses', 'الدورات', '/courses', 3, true, '_self'),
  ('d0000000-0000-0000-0000-000000000002', 'Careers', 'الوظائف', '/careers', 4, true, '_self'),
  ('d0000000-0000-0000-0000-000000000002', 'Contact', 'اتصل بنا', '/contact', 5, true, '_self'),
  ('d0000000-0000-0000-0000-000000000002', 'Privacy Policy', 'سياسة الخصوصية', '/privacy-policy', 6, true, '_self'),
  ('d0000000-0000-0000-0000-000000000002', 'Terms & Conditions', 'الشروط والأحكام', '/terms', 7, true, '_self');
