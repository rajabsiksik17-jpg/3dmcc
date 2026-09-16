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
