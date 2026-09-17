-- =============================================================================
-- 3DMCC — Email templates: dedicated templates per request type + proper variables
-- =============================================================================

insert into public.email_templates (key, subject_en, subject_ar, body_en, body_ar) values

('course_registration_received', 'Course Registration Request Received', 'تم استلام طلب التسجيل في الدورة',
'Hello {{customer_name}},

Thank you for registering for the course:

{{course_name}}

Your registration request has been received successfully. Our team will review it and contact you shortly with further details and next steps.

Request Number: {{request_id}}
Request Date: {{request_date}}

If you have any questions, feel free to contact us using the details below.

Best regards,
The {{company_name}} Team',
'مرحباً {{customer_name}}،

شكراً لتسجيلك في الدورة:

{{course_name}}

لقد تم استلام طلب التسجيل بنجاح، وسيقوم فريقنا بمراجعة الطلب والتواصل معك قريباً لتزويدك بالتفاصيل والخطوات التالية.

رقم الطلب: {{request_id}}
تاريخ الطلب: {{request_date}}

وفي حال وجود أي استفسار، يمكنك التواصل معنا عبر بيانات الاتصال الموجودة في أسفل الرسالة.

مع أطيب التحيات،
فريق {{company_name}}'),

('job_application_received', 'Job Application Request Received', 'تم استلام طلب التقديم على الوظيفة',
'Hello {{customer_name}},

Thank you for applying for the position:

{{job_title}}

Your application has been received successfully. Our team will review your details and contact you when needed.

Request Number: {{request_id}}
Application Date: {{request_date}}

Thank you for your interest in joining our team.

Best regards,
The {{company_name}} Team',
'مرحباً {{customer_name}}،

شكراً لتقديمك على الوظيفة:

{{job_title}}

لقد تم استلام طلب التقديم بنجاح، وسيقوم فريقنا بمراجعة بياناتك والتواصل معك عند الحاجة.

رقم الطلب: {{request_id}}
تاريخ التقديم: {{request_date}}

شكراً لاهتمامك بالانضمام إلى فريقنا.

مع أطيب التحيات،
فريق {{company_name}}'),

('contact_received', 'Your message has been received', 'تم استلام رسالتك',
'Hello {{customer_name}},

Thank you for contacting us.

Your message has been received successfully. Our team will review your request and get back to you as soon as possible.

Request Number: {{request_id}}
Message Date: {{request_date}}

Thank you for reaching out to us.

Best regards,
The {{company_name}} Team',
'مرحباً {{customer_name}}،

شكراً لتواصلك معنا.

تم استلام رسالتك بنجاح، وسيقوم فريقنا بمراجعة طلبك والتواصل معك في أقرب وقت ممكن.

رقم الطلب: {{request_id}}
تاريخ الرسالة: {{request_date}}

شكراً لتواصلك معنا.

مع أطيب التحيات،
فريق {{company_name}}'),

('service_request_received', 'Service Request Received', 'تم استلام طلب الخدمة',
'Hello {{customer_name}},

Thank you for requesting our service:

{{service_name}}

Your request has been received successfully. Our team will review it and contact you shortly.

Request Number: {{request_id}}
Request Date: {{request_date}}

Best regards,
The {{company_name}} Team',
'مرحباً {{customer_name}}،

شكراً لطلبك الخدمة التالية:

{{service_name}}

لقد تم استلام طلبك بنجاح، وسيقوم فريقنا بمراجعته والتواصل معك قريباً.

رقم الطلب: {{request_id}}
تاريخ الطلب: {{request_date}}

مع أطيب التحيات،
فريق {{company_name}}'),

('admin_notification', 'New {{type}} received', 'تم استلام {{type}} جديد',
'A new {{type}} has been received.

Customer: {{customer_name}}
{{entity_label}}: {{entity_name}}
Request Number: {{request_id}}
Date: {{request_date}}
Email: {{customer_email}}
Phone: {{customer_phone}}',
'تم استلام {{type}} جديد.

العميل: {{customer_name}}
{{entity_label}}: {{entity_name}}
رقم الطلب: {{request_id}}
التاريخ: {{request_date}}
البريد: {{customer_email}}
الهاتف: {{customer_phone}}')

on conflict (key) do update set
  subject_en = excluded.subject_en,
  subject_ar = excluded.subject_ar,
  body_en = excluded.body_en,
  body_ar = excluded.body_ar;
