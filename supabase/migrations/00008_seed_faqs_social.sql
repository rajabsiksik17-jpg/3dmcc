-- =============================================================================
-- 3DMCC — Seed: FAQs, testimonials (demo/unpublished), clients & partners (demo)
-- =============================================================================

insert into public.faqs (question_en, question_ar, answer_en, answer_ar, sort_order, published) values
(
  'What services does 3DMCC offer?',
  'ما الخدمات التي تقدمها 3DMCC؟',
  '3DMCC provides management consulting, HR consulting, HR outsourcing, payroll, performance management, economic feasibility studies, wealth management, corporate finance and accounting consulting, training and development, and architecture design consultation services.',
  'تقدم 3DMCC خدمات الاستشارات الإدارية، واستشارات الموارد البشرية، وتعهيد الموارد البشرية، والرواتب، وإدارة الأداء، ودراسات الجدوى الاقتصادية، وإدارة الثروات، واستشارات التمويل والمحاسبة للشركات، والتدريب والتطوير، واستشارات التصميم المعماري.',
  1, true
),
(
  'What industries do you serve?',
  'ما القطاعات التي تخدمونها؟',
  'We serve private enterprises and individuals across a wide range of sectors, tailoring our solutions to each client''s unique needs and objectives.',
  'نخدم الشركات والأفراد في مجموعة واسعة من القطاعات، ونصمم حلولنا وفق الاحتياجات والأهداف الفريدة لكل عميل.',
  2, true
),
(
  'How can I request a service?',
  'كيف يمكنني طلب خدمة؟',
  'You can request a service by filling the inquiry form on any service page, or by contacting us directly through our contact page, phone, or email.',
  'يمكنك طلب خدمة من خلال تعبئة نموذج الاستفسار في أي صفحة خدمة، أو التواصل معنا مباشرة عبر صفحة الاتصال أو الهاتف أو البريد الإلكتروني.',
  3, true
),
(
  'Do you offer training courses for individuals and companies?',
  'هل تقدمون دورات تدريبية للأفراد والشركات؟',
  'Yes. 3DMCC offers practical training and development courses in HR, scientific research, AI and programming, business intelligence and data analytics, and soft skills and leadership for both individuals and organizations.',
  'نعم. تقدم 3DMCC دورات تدريبية عملية في الموارد البشرية والبحث العلمي والذكاء الاصطناعي والبرمجة وذكاء الأعمال وتحليل البيانات والمهارات الناعمة والقيادة للأفراد والمؤسسات.',
  4, true
),
(
  'Where is 3DMCC located?',
  'أين تقع 3DMCC؟',
  '3DMCC is based in Jordan, serving clients nationwide and across the region.',
  'تقع 3DMCC في الأردن وتخدم العملاء في جميع أنحاء المملكة والمنطقة.',
  5, true
),
(
  'How can I contact 3DMCC?',
  'كيف يمكنني التواصل مع 3DMCC؟',
  'You can reach us by phone at +962 7 9237 9011, by email at info@3dmcc.net, or through the contact form on our website.',
  'يمكنك التواصل معنا عبر الهاتف على +962 7 9237 9011، أو عبر البريد الإلكتروني info@3dmcc.net، أو من خلال نموذج الاتصال على موقعنا.',
  6, true
);

-- ---------------------------------------------------------------------------
-- Testimonials — DEMO content, unpublished. Marked so they are not presented
-- as genuine client statements. Publish only after replacing with real data.
-- ---------------------------------------------------------------------------
insert into public.testimonials (client_name, position, company, content_en, content_ar, rating, published, featured, sort_order) values
(
  'Sample Client',
  'Business Owner',
  'Demo Company',
  'Demo testimonial. Replace with genuine client feedback before publishing.',
  'رأي تجريبي. استبدله بملاحظات حقيقية من العملاء قبل النشر.',
  5, false, false, 1
),
(
  'Sample Client 2',
  'HR Manager',
  'Demo Organization',
  'Demo testimonial. Replace with genuine client feedback before publishing.',
  'رأي تجريبي. استبدله بملاحظات حقيقية من العملاء قبل النشر.',
  5, false, false, 2
);

-- ---------------------------------------------------------------------------
-- Clients & partners — DEMO placeholders, inactive so they are never shown
-- as real. Set active=true and is_demo=false once real records exist.
-- ---------------------------------------------------------------------------
insert into public.clients (name, website, description, featured, active, sort_order, is_demo) values
('Sample Client A', 'https://example.com', 'Demo placeholder — replace with a real client.', false, false, 1, true),
('Sample Client B', 'https://example.com', 'Demo placeholder — replace with a real client.', false, false, 2, true);

insert into public.partners (name, website, description, featured, active, sort_order, is_demo) values
('Sample Partner A', 'https://example.com', 'Demo placeholder — replace with a real partner.', false, false, 1, true),
('Sample Partner B', 'https://example.com', 'Demo placeholder — replace with a real partner.', false, false, 2, true);
