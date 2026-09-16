import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  encryption: "tls" | "ssl" | "none";
  fromName: string;
  fromEmail: string;
}

function encryptionKey(): Buffer {
  const secret =
    process.env.SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "3dmcc-dev-secret-change-me";
  return createHash("sha256").update(secret).digest();
}

export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(".");
}

export function decrypt(payload: string): string {
  const [iv, tag, data] = payload.split(".");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
}

export async function getSmtpConfig(): Promise<SmtpConfig> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("email_settings").select("config").limit(1).maybeSingle();
    const cfg = (data?.config ?? {}) as Record<string, unknown>;
    if (cfg.host) {
      return {
        host: String(cfg.host),
        port: Number(cfg.port ?? 587),
        user: String(cfg.user ?? ""),
        password: cfg.password ? decrypt(String(cfg.password)) : "",
        encryption: (cfg.encryption as SmtpConfig["encryption"]) ?? "tls",
        fromName: String(cfg.fromName ?? "3DMCC"),
        fromEmail: String(cfg.fromEmail ?? "info@3dmcc.net"),
      };
    }
  } catch {
    // fall through to env
  }

  return {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    password: process.env.SMTP_PASSWORD ?? "",
    encryption: (process.env.SMTP_ENCRYPTION as SmtpConfig["encryption"]) ?? "tls",
    fromName: process.env.SMTP_FROM_NAME ?? "3DMCC",
    fromEmail: process.env.SMTP_FROM_EMAIL ?? "info@3dmcc.net",
  };
}

function buildTransporter(cfg: SmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.encryption === "ssl",
    auth: cfg.user ? { user: cfg.user, pass: cfg.password } : undefined,
    requireTLS: cfg.encryption !== "none",
  });
}

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  const cfg = await getSmtpConfig();
  if (!cfg.host) {
    return { ok: false, error: "SMTP is not configured" };
  }
  const transporter = buildTransporter(cfg);
  await transporter.sendMail({
    from: `"${cfg.fromName}" <${cfg.fromEmail}>`,
    to,
    subject,
    text,
    html: html ?? text.replace(/\n/g, "<br/>"),
  });
  return { ok: true };
}

export async function testSmtp() {
  const cfg = await getSmtpConfig();
  if (!cfg.host) {
    return { ok: false, error: "SMTP is not configured" };
  }
  const transporter = buildTransporter(cfg);
  await transporter.verify();
  return { ok: true };
}

export function renderTemplate(body: string, vars: Record<string, string | number>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ""));
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13.5 9H16l.5-3h-3V4.5c0-.9.3-1.5 1.6-1.5H16V.2C15.7.2 14.7.1 13.6.1 11.3.1 9.8 1.5 9.8 4.1V6H7v3h2.8v9h3.7V9z"/></svg>',
  instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.6.2-2 .3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.4-.3.9-.3 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.6.3 2 .2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.1.9.3 2 .3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.6-.2 2-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.4.3-.9.3-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.6-.3-2-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.1-.9-.3-2-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 8.1a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zm6.2-8.3a1.1 1.1 0 11-2.3 0 1.1 1.1 0 012.3 0z"/></svg>',
  linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v14H.2V8zm7.6 0h4.4v1.9h.1c.6-1.2 2.1-2.4 4.3-2.4 4.6 0 5.4 3 5.4 6.9V22h-4.6v-6.6c0-1.6 0-3.6-2.2-3.6s-2.6 1.7-2.6 3.5V22H7.8V8z"/></svg>',
  youtube: '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M23.5 6.2c-.3-1-1.1-1.8-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5C1.6 4.4.8 5.2.5 6.2 0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1.1 1.8 2.1 2.1 1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5c1-.3 1.8-1.1 2.1-2.1.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>',
  twitter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.2 2h3.3l-7.3 8.3L22.8 22h-6.7l-5.3-6.9L4.8 22H1.5l7.8-8.9L1 2h6.9l4.8 6.3L18.2 2zm-1.2 18h1.9L7 4H5l12 16z"/></svg>',
};

const SOCIAL_COLORS: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  twitter: "#000000",
};

export function buildEmailHtml(opts: {
  locale: "en" | "ar";
  company: { name: string; logo_url?: string | null; email?: string | null; phone?: string | null; address?: string | null; website?: string | null; socials?: { key: string; url: string }[] };
  body: string;
}): string {
  const { locale, company, body } = opts;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const align = locale === "ar" ? "right" : "left";
  const name = company.name || "3DMCC";
  const footerText = locale === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved";

  const bodyHtml = body
    .split("\n")
    .map((line) => (line.trim() ? `<p style="margin:0 0 12px;color:#43454C;line-height:1.7;">${escapeHtml(line)}</p>` : "<br/>"))
    .join("");

  const socials = (company.socials ?? [])
    .filter((s) => s.url && SOCIAL_ICONS[s.key])
    .map(
      (s) =>
        `<a href="${escapeHtml(s.url)}" style="display:inline-block;margin:0 4px;width:32px;height:32px;border-radius:50%;background:${SOCIAL_COLORS[s.key]};text-align:center;line-height:36px;">${SOCIAL_ICONS[s.key]}</a>`
    )
    .join("");

  const logo = company.logo_url
    ? `<img src="${escapeHtml(company.logo_url)}" alt="${escapeHtml(name)}" style="max-height:40px;" />`
    : `<span style="font-size:20px;font-weight:700;color:#F58A2A;">${escapeHtml(name)}</span>`;

  const contactLine = [
    company.email ? `Email: ${escapeHtml(company.email)}` : "",
    company.phone ? `Phone: ${escapeHtml(company.phone)}` : "",
    company.address ? escapeHtml(company.address) : "",
    company.website ? escapeHtml(company.website) : "",
  ]
    .filter(Boolean)
    .join(" &nbsp;|&nbsp; ");

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<body style="margin:0;padding:0;background:#F6F6F7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F6F7;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#141519;padding:24px;text-align:center;">
            ${logo}
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px;text-align:${align};">
            ${bodyHtml}
          </td>
        </tr>
        ${socials ? `<tr><td style="padding:0 28px 28px;text-align:center;">${socials}</td></tr>` : ""}
        <tr>
          <td style="background:#F6F6F7;padding:20px 28px;text-align:center;color:#84868F;font-size:12px;">
            ${contactLine ? `<p style="margin:0 0 8px;">${contactLine}</p>` : ""}
            <p style="margin:0;">© ${new Date().getFullYear()} ${escapeHtml(name)}. ${footerText}.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendTemplateEmail(opts: {
  to: string;
  locale: "en" | "ar";
  templateKey: string;
  vars: Record<string, string | number>;
}) {
  const admin = createAdminClient();
  const [{ data: template }, { data: settings }] = await Promise.all([
    admin.from("email_templates").select("*").eq("key", opts.templateKey).maybeSingle(),
    admin.from("company_settings").select("*").limit(1).maybeSingle(),
  ]);

  if (!template) return { ok: false, error: "Template not found" };

  const subject = opts.locale === "ar" ? template.subject_ar : template.subject_en;
  const rawBody = opts.locale === "ar" ? template.body_ar : template.body_en;
  const body = renderTemplate(rawBody, opts.vars);

  const socials = [
    { key: "facebook", url: settings?.facebook },
    { key: "instagram", url: settings?.instagram },
    { key: "linkedin", url: settings?.linkedin },
    { key: "youtube", url: settings?.youtube },
    { key: "twitter", url: settings?.twitter },
  ].filter((s): s is { key: string; url: string } => Boolean(s.url));

  const html = buildEmailHtml({
    locale: opts.locale,
    company: {
      name: opts.locale === "ar" ? settings?.name_ar ?? "3DMCC" : settings?.name_en ?? "3DMCC",
      logo_url: settings?.logo_url,
      email: settings?.email,
      phone: settings?.phone,
      address: opts.locale === "ar" ? settings?.address_ar : settings?.address_en,
      website: settings?.website,
      socials,
    },
    body,
  });

  return sendMail(opts.to, subject, body, html);
}

export function detectLocale(values: Record<string, unknown>): "en" | "ar" {
  const sample = Object.values(values).map((v) => (typeof v === "string" ? v : "")).join(" ");
  return /[\u0600-\u06FF]/.test(sample) ? "ar" : "en";
}
