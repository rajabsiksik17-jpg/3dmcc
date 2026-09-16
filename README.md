# 3DMCC — Corporate Website

A modern, premium, bilingual (English/Arabic) corporate website and CMS for
**3D for Management Consulting Company (3DMCC)** — https://3dmcc.net

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**,
**next-intl** (i18n + RTL), **Supabase** (PostgreSQL, Auth, Storage, RLS), and a
full **Admin Dashboard / CMS**.

---

## Features

- **Bilingual + RTL** — `/en` and `/ar` routes, `dir="rtl"` for Arabic, language switcher.
- **CMS-driven content** — pages, sections, services, courses, jobs, team, FAQs, media, menus, company info, SEO are all managed from the admin dashboard (no code changes needed).
- **Dynamic page builder** — reusable section types rendered by a central `SectionRenderer`.
- **Dynamic form builder** — configurable fields, validation, conditional fields, file uploads, phone input (libphonenumber, Jordan default).
- **Admin dashboard** — role-based access (Super Admin, Admin, Editor, HR Manager, Content Manager), notifications, submissions inbox, activity tracking.
- **Integrations** — Google Analytics 4, Google Search Console, SMTP, IMAP, Google Maps.
- **SEO** — per-page metadata, JSON-LD structured data, `sitemap.xml`, `robots.txt`.
- **Security** — Supabase Row Level Security, server-side validation (Zod), honeypot + rate limiting, encrypted SMTP credentials, signed/private uploads.

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| i18n      | next-intl (en/ar + RTL) |
| Backend   | Supabase (PostgreSQL, Auth, Storage, Edge/RLS) |
| Forms     | react-hook-form, Zod, libphonenumber-js |
| UI        | Lucide React, Framer Motion |
| Email     | nodemailer (SMTP) |

---

## Prerequisites

- Node.js **20+** (tested on 22)
- npm
- A [Supabase](https://supabase.com) project
- (Optional) [Supabase CLI](https://supabase.com/docs/guides/cli) for local DB / migrations

---

## 1. Installation

```bash
git clone <your-repo-url> 3dmcc-website
cd 3dmcc-website
npm install
```

## 2. Environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

Required:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
NEXT_PUBLIC_SITE_URL=https://3dmcc.net
```

Optional (integrations): see `.env.example` for SMTP / IMAP / Analytics.

> Never commit `.env.local`. The `.gitignore` already excludes it.

## 3. Supabase setup

Run the SQL migrations in order against your Supabase project. The migrations
create all tables, indexes, RLS policies, storage buckets, triggers, functions,
and **seed data**:

1. Open Supabase Dashboard → **SQL Editor**.
2. Run each file in `supabase/migrations/` in numeric order, **or** use the CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Migrations are idempotent (safe to re-run). They seed:

- Roles & permissions
- Company settings (phone `+962 7 9237 9011`, email `info@3dmcc.net`)
- Service categories + 14 services
- Course categories + 5 courses
- 5 sample job vacancies (marked *Sample*)
- FAQs, menus, contact/service/career/course forms with default fields
- Homepage & About page sections, legal pages, SEO defaults, email templates

## 4. Create the first Super Admin

1. In Supabase Dashboard → **Authentication → Users**, add a user
   (email + password), or use the admin dashboard's *Users* screen later.
2. In **SQL Editor**, promote the user:

```sql
update public.profiles set role = 'super_admin'
where id = (select id from auth.users where email = 'you@example.com');
```

## 5. Local development

```bash
npm run dev
```

Open http://localhost:3000 (redirects to `/en`). Admin: http://localhost:3000/admin

## 6. Build

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

---

## 7. Production deployment (Hostinger)

> **Important:** Hostinger's *shared hosting* does **not** run a Next.js server
> runtime. Use **Hostinger VPS** (Node.js) or any Node-capable host (Vercel,
> Railway, Render, a VPS with PM2/Docker) to run the server.

### VPS (Node.js + PM2)

```bash
npm ci
npm run build
# ensure .env.local / .env is populated
pm2 start npm --name 3dmcc -- start
pm2 save
```

Or run behind a reverse proxy (Nginx/Caddy) proxying to `localhost:3000`.

### Docker

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Domain configuration

1. Point your domain (`3dmcc.net`) to your host (A record / CNAME).
2. Set `NEXT_PUBLIC_SITE_URL=https://3dmcc.net`.
3. Enable HTTPS (Let's Encrypt via your reverse proxy or host).
4. Add your domain to Supabase **Auth → URL Configuration → Site URL** and
   **Redirect URLs** (`https://3dmcc.net/**`, `https://3dmcc.net/auth/callback`).

---

## 8. Troubleshooting

- **"Missing Supabase environment variables"** — `.env.local` is not configured.
- **Login works but redirects back** — the profile role isn't set; see step 4.
- **Forms submit but nothing stored** — migrations not applied; run `supabase db push`.
- **File upload fails** — `SUPABASE_SERVICE_ROLE_KEY` missing, or the `private`
  storage bucket wasn't created (run the storage migration).
- **Emails not sending** — configure SMTP in Admin → Integrations and run
  *Test SMTP Connection*.
- **Analytics not loading** — configure the GA4 Measurement ID in Admin → Integrations.

---

## Documentation

See [`docs/`](./docs) for architecture, database schema, authentication/RBAC,
the form builder, and deployment details.
