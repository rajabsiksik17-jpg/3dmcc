# 3DMCC — Documentation

## Architecture

```
src/
├── app/
│   ├── [locale]/            # Public bilingual site (next-intl)
│   │   ├── page.tsx         # Home (renders dynamic page sections)
│   │   ├── about/ services/ courses/ careers/ contact/ ...
│   │   └── layout.tsx       # Header, Footer, language, RTL
│   ├── admin/               # Admin dashboard (separate root layout)
│   │   ├── login/ reset-password/
│   │   ├── (app)/           # Authenticated area (sidebar + guard)
│   │   └── actions/         # Server actions (auth, content CRUD)
│   ├── api/upload/          # Public file upload (private bucket)
│   ├── auth/callback/       # Supabase auth callback (password reset)
│   ├── sitemap.ts robots.ts # SEO
├── components/
│   ├── layout/ sections/ cards/ forms/ ui/ admin/ explorers/
├── i18n/                    # next-intl routing + request config
├── lib/
│   ├── supabase/            # browser / server / admin clients
│   ├── data/public.ts       # cached public read queries
│   ├── admin-data.ts        # admin (service-role) read queries
│   ├── auth.ts              # auth + RBAC helpers
│   ├── email.ts             # SMTP + encryption
│   └── ...
├── middleware.ts            # locale routing (excludes /admin, /api, /auth)
├── types/database.ts        # Supabase Database types (manual; regen with db:types)
└── messages/                # en.json / ar.json UI strings
```

**Rendering model:** public pages are server-rendered (`force-dynamic`) because
all content is database-managed. A central `SectionRenderer` maps a section
`type` to a React component (`hero`, `services_grid`, `cta`, ...), so new
sections can be added without touching page code.

## Database

Tables (see `supabase/migrations/00001_schema.sql` for full definitions):

- **Identity/RBAC**: `profiles`, `roles`
- **Content**: `pages`, `page_sections`, `services`, `service_categories`,
  `courses`, `course_categories`, `jobs`
- **Forms**: `forms`, `form_fields`, `form_submissions`, `form_submission_values`
- **Company/global**: `company_settings`, `menus`, `menu_items`, `media`,
  `team_members`, `clients`, `partners`, `testimonials`, `faqs`
- **System**: `notifications`, `email_settings`, `email_templates`,
  `integrations`, `seo_settings`, `activity_logs`, `audit_logs`

Conventions: UUID primary keys, `created_at`/`updated_at` timestamps, soft-delete
(`deleted_at`) for services/courses/jobs/pages, bilingual fields use `_en`/`_ar`
suffixes or JSONB.

**Row Level Security** (`00003_rls.sql`):
- Anonymous users can only `SELECT` published public content and active forms.
- Anonymous users **cannot** insert/update/delete.
- Public form submission goes through the security-definer function
  `submit_public_form` (`00011_rpc.sql`).
- Admins use `is_admin()` / `has_permission()` security-definer helpers.
- Sensitive tables (`integrations`, `email_settings`, `roles`) are Super Admin only.

## Authentication & Roles

- Supabase Auth (email/password). No public registration for admins.
- On signup, a `profiles` row is created via the `handle_new_user` trigger.
- Roles: `super_admin`, `admin`, `editor`, `hr_manager`, `content_manager`.
- Permissions are checked with `requireAdmin` / `requirePermission` /
  `requireSuperAdmin` in server actions and pages.
- Admin mutations run through the **service-role** client (server-only), guarded
  by the permission helpers.

## Forms

The **Dynamic Form Builder** is a single reusable system (not three hard-coded
forms). A `forms` row has `type` (`contact|service|career|course|custom`),
`status`, success messages, and email notification/auto-reply settings.
`form_fields` define each field (label en/ar, name, type, placeholder, required,
validation, options, width, sort order).

Supported field types: `text`, `textarea`, `email`, `phone`, `number`, `date`,
`time`, `select`, `multiselect`, `checkbox`, `radio`, `file`, `url`, `country`,
`city`, `company_name`, `job_title`.

Client validation uses react-hook-form + a dynamically built Zod schema; the
server re-validates in `submit-form.ts` (required, email, phone, URL, sanitization,
honeypot, rate limiting) and inserts via `submit_public_form`.

File uploads go to the `private` storage bucket through `/api/upload`; CVs and
attachments are never publicly readable (admin uses signed URLs).

## Integrations

- **Google Analytics 4** — Measurement ID stored in `integrations`; *Test
  Connection* calls the GA4 debug endpoint.
- **Google Search Console** — verification meta tag + property URL.
- **SMTP** — stored (password AES-256-GCM encrypted) in `email_settings`;
  *Test SMTP* runs `nodemailer.verify()`.
- **IMAP** — connectivity/TLS check.
- **Google Maps** — URL + embed URL from `company_settings`.

## Deployment

See `README.md` section 7. Hostinger shared hosting cannot run the Next.js
server — use a VPS (Node.js + PM2 or Docker) or a Node-capable host.

## Troubleshooting

See `README.md` section 8.
