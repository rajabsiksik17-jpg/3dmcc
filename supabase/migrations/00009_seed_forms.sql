-- =============================================================================
-- 3DMCC — Seed: Forms & form fields
-- =============================================================================

insert into public.forms (id, name, slug, type, status, description, success_message_en, success_message_ar, email_notification, auto_reply, recipient_email) values
(
  '11111111-1111-1111-1111-111111111111',
  'Contact Form', 'contact-form', 'contact', 'active',
  'Default contact form', 'Thank you! Your message has been received. Our team will contact you shortly.', 'شكراً لك! تم استلام رسالتك. سيتواصل معك فريقنا قريباً.', true, true, 'info@3dmcc.net'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Service Inquiry Form', 'service-inquiry-form', 'service', 'active',
  'Default service inquiry form', 'Thank you! Your service request has been received. Our team will contact you shortly.', 'شكراً لك! تم استلام طلب الخدمة. سيتواصل معك فريقنا قريباً.', true, true, 'info@3dmcc.net'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Job Application Form', 'job-application-form', 'career', 'active',
  'Default job application form', 'Thank you! Your application has been received. Our HR team will review it and contact you if there is a match.', 'شكراً لك! تم استلام طلبك. سيقوم فريق الموارد البشرية بمراجعته والتواصل معك في حال وجود تطابق.', true, true, 'info@3dmcc.net'
),
(
  '44444444-4444-4444-4444-444444444444',
  'Course Registration Form', 'course-registration-form', 'course', 'active',
  'Default course registration form', 'Thank you! Your registration has been received. We will contact you with further details.', 'شكراً لك! تم استلام تسجيلك. سوف نتواصل معك بمزيد من التفاصيل.', true, true, 'info@3dmcc.net'
);

-- link forms to entities
update public.services set form_id = '22222222-2222-2222-2222-222222222222' where form_id is null;
update public.courses set form_id = '44444444-4444-4444-4444-444444444444' where form_id is null;
update public.jobs set form_id = '33333333-3333-3333-3333-333333333333' where form_id is null;

-- ---------------------------------------------------------------------------
-- Contact form fields
-- ---------------------------------------------------------------------------
insert into public.form_fields (form_id, label_en, label_ar, name, type, placeholder_en, placeholder_ar, required, sort_order, width) values
('11111111-1111-1111-1111-111111111111', 'Full Name', 'الاسم الكامل', 'full_name', 'text', 'Enter your full name', 'أدخل اسمك الكامل', true, 1, 'full'),
('11111111-1111-1111-1111-111111111111', 'Company', 'الشركة', 'company', 'company_name', 'Enter your company name', 'أدخل اسم شركتك', false, 2, 'full'),
('11111111-1111-1111-1111-111111111111', 'Email', 'البريد الإلكتروني', 'email', 'email', 'Enter your email', 'أدخل بريدك الإلكتروني', true, 3, 'half'),
('11111111-1111-1111-1111-111111111111', 'Phone', 'الهاتف', 'phone', 'phone', 'Enter your phone number', 'أدخل رقم هاتفك', true, 4, 'half'),
('11111111-1111-1111-1111-111111111111', 'Country', 'الدولة', 'country', 'country', 'Select your country', 'اختر دولتك', false, 5, 'half'),
('11111111-1111-1111-1111-111111111111', 'Subject', 'الموضوع', 'subject', 'text', 'Enter a subject', 'أدخل الموضوع', false, 6, 'half'),
('11111111-1111-1111-1111-111111111111', 'Message', 'الرسالة', 'message', 'textarea', 'Enter your message', 'أدخل رسالتك', true, 7, 'full'),
('11111111-1111-1111-1111-111111111111', 'Preferred Contact Method', 'طريقة التواصل المفضلة', 'preferred_contact', 'select', null, null, false, 8, 'full');

-- options for preferred_contact
update public.form_fields set options = '[
  {"value": "email", "label_en": "Email", "label_ar": "البريد الإلكتروني"},
  {"value": "phone", "label_en": "Phone", "label_ar": "الهاتف"},
  {"value": "whatsapp", "label_en": "WhatsApp", "label_ar": "واتساب"}
]'::jsonb
where form_id = '11111111-1111-1111-1111-111111111111' and name = 'preferred_contact';

-- ---------------------------------------------------------------------------
-- Service inquiry form fields
-- ---------------------------------------------------------------------------
insert into public.form_fields (form_id, label_en, label_ar, name, type, placeholder_en, placeholder_ar, required, sort_order, width) values
('22222222-2222-2222-2222-222222222222', 'Full Name', 'الاسم الكامل', 'full_name', 'text', 'Enter your full name', 'أدخل اسمك الكامل', true, 1, 'full'),
('22222222-2222-2222-2222-222222222222', 'Company', 'الشركة', 'company', 'company_name', 'Enter your company name', 'أدخل اسم شركتك', false, 2, 'full'),
('22222222-2222-2222-2222-222222222222', 'Email', 'البريد الإلكتروني', 'email', 'email', 'Enter your email', 'أدخل بريدك الإلكتروني', true, 3, 'half'),
('22222222-2222-2222-2222-222222222222', 'Phone', 'الهاتف', 'phone', 'phone', 'Enter your phone number', 'أدخل رقم هاتفك', true, 4, 'half'),
('22222222-2222-2222-2222-222222222222', 'Country', 'الدولة', 'country', 'country', 'Select your country', 'اختر دولتك', false, 5, 'half'),
('22222222-2222-2222-2222-222222222222', 'Service of Interest', 'الخدمة المطلوبة', 'service_of_interest', 'text', 'Which service are you interested in?', 'ما الخدمة التي تهمك؟', false, 6, 'half'),
('22222222-2222-2222-2222-222222222222', 'Project Details', 'تفاصيل المشروع', 'project_details', 'textarea', 'Describe your project or requirements', 'صف مشروعك أو متطلباتك', true, 7, 'full');

-- ---------------------------------------------------------------------------
-- Job application form fields
-- ---------------------------------------------------------------------------
insert into public.form_fields (form_id, label_en, label_ar, name, type, placeholder_en, placeholder_ar, required, validation, sort_order, width) values
('33333333-3333-3333-3333-333333333333', 'Full Name', 'الاسم الكامل', 'full_name', 'text', 'Enter your full name', 'أدخل اسمك الكامل', true, null, 1, 'full'),
('33333333-3333-3333-3333-333333333333', 'Email', 'البريد الإلكتروني', 'email', 'email', 'Enter your email', 'أدخل بريدك الإلكتروني', true, null, 2, 'half'),
('33333333-3333-3333-3333-333333333333', 'Phone', 'الهاتف', 'phone', 'phone', 'Enter your phone number', 'أدخل رقم هاتفك', true, null, 3, 'half'),
('33333333-3333-3333-3333-333333333333', 'Country', 'الدولة', 'country', 'country', 'Select your country', 'اختر دولتك', false, null, 4, 'half'),
('33333333-3333-3333-3333-333333333333', 'City', 'المدينة', 'city', 'city', 'Enter your city', 'أدخل مدينتك', false, null, 5, 'half'),
('33333333-3333-3333-3333-333333333333', 'LinkedIn URL', 'رابط LinkedIn', 'linkedin', 'url', 'https://linkedin.com/in/...', 'https://linkedin.com/in/...', false, '{"type":"url"}'::jsonb, 6, 'half'),
('33333333-3333-3333-3333-333333333333', 'Portfolio URL', 'رابط الأعمال', 'portfolio', 'url', 'https://...', 'https://...', false, '{"type":"url"}'::jsonb, 7, 'half'),
('33333333-3333-3333-3333-333333333333', 'Cover Letter', 'خطاب التقديم', 'cover_letter', 'textarea', 'Tell us why you are a good fit', 'أخبرنا لماذا أنت مناسب', false, null, 8, 'full'),
('33333333-3333-3333-3333-333333333333', 'CV Upload', 'رفع السيرة الذاتية', 'cv', 'file', null, null, true, '{"maxSizeMB":10,"allowedTypes":["pdf","doc","docx"]}'::jsonb, 9, 'full'),
('33333333-3333-3333-3333-333333333333', 'Additional Documents', 'مستندات إضافية', 'additional_documents', 'file', null, null, false, '{"maxSizeMB":10,"allowedTypes":["pdf","doc","docx","jpg","png"]}'::jsonb, 10, 'full'),
('33333333-3333-3333-3333-333333333333', 'Additional Message', 'رسالة إضافية', 'additional_message', 'textarea', 'Anything else we should know?', 'أي شيء آخر يجب أن نعرفه؟', false, null, 11, 'full');

-- ---------------------------------------------------------------------------
-- Course registration form fields
-- ---------------------------------------------------------------------------
insert into public.form_fields (form_id, label_en, label_ar, name, type, placeholder_en, placeholder_ar, required, sort_order, width) values
('44444444-4444-4444-4444-444444444444', 'Full Name', 'الاسم الكامل', 'full_name', 'text', 'Enter your full name', 'أدخل اسمك الكامل', true, 1, 'full'),
('44444444-4444-4444-4444-444444444444', 'Email', 'البريد الإلكتروني', 'email', 'email', 'Enter your email', 'أدخل بريدك الإلكتروني', true, 2, 'half'),
('44444444-4444-4444-4444-444444444444', 'Phone', 'الهاتف', 'phone', 'phone', 'Enter your phone number', 'أدخل رقم هاتفك', true, 3, 'half'),
('44444444-4444-4444-4444-444444444444', 'Country', 'الدولة', 'country', 'country', 'Select your country', 'اختر دولتك', false, 4, 'half'),
('44444444-4444-4444-4444-444444444444', 'Company', 'الشركة', 'company', 'company_name', 'Enter your company name', 'أدخل اسم شركتك', false, 5, 'half'),
('44444444-4444-4444-4444-444444444444', 'Current Role', 'المسمى الوظيفي الحالي', 'current_role', 'job_title', 'Enter your current job title', 'أدخل مسمى وظيفتك الحالي', false, 6, 'full'),
('44444444-4444-4444-4444-444444444444', 'Additional Message', 'رسالة إضافية', 'additional_message', 'textarea', 'Anything else we should know?', 'أي شيء آخر يجب أن نعرفه؟', false, 7, 'full');
