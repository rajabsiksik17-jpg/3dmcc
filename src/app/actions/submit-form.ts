"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { sendTemplateEmail, detectLocale } from "@/lib/email";
import { headers } from "next/headers";
import { isValidPhoneNumber } from "libphonenumber-js";
import type { Json } from "@/types/database";

const submissionSchema = z.object({
  formId: z.string().uuid(),
  formType: z.string(),
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
  values: z.record(z.unknown()),
  website: z.string().optional(), // honeypot
});

function sanitize(value: unknown): Json {
  if (typeof value === "string") {
    return value.replace(/<[^>]*>/g, "").slice(0, 20000);
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitize(v);
    }
    return out;
  }
  return null;
}

export async function submitForm(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid submission" };
  }

  const { formId, formType, entityType, entityId, values, website } = parsed.data;

  // Honeypot: bots fill hidden fields
  if (website && website.length > 0) {
    return { ok: true }; // silently ignore bots
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`form:${formId}:${ip}`);
  if (!rl.allowed) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  // Load form + fields to validate server-side
  const supabase = await createClient();
  const { data: form } = await supabase.from("forms").select("*").eq("id", formId).eq("status", "active").maybeSingle();
  if (!form) return { ok: false, error: "Form not available" };

  const { data: fields } = await supabase.from("form_fields").select("*").eq("form_id", formId).order("sort_order");

  const cleaned: Record<string, unknown> = {};
  for (const field of fields ?? []) {
    const raw = values[field.name];
    if (field.required) {
      const isEmpty =
        raw === undefined || raw === null || raw === "" ||
        (Array.isArray(raw) && raw.length === 0);
      if (isEmpty) {
        return { ok: false, error: `Field required: ${field.name}` };
      }
    }

    if (raw === undefined || raw === null || raw === "") continue;

    const vtype = field.validation as { type?: string } | null;
    if (field.type === "email" || vtype?.type === "email") {
      if (!z.string().email().safeParse(String(raw)).success) {
        return { ok: false, error: "Invalid email" };
      }
    }
    if (field.type === "phone" || vtype?.type === "phone") {
      const phone = typeof raw === "string" ? raw : (raw as { internationalNumber?: string })?.internationalNumber;
      if (phone && !isValidPhoneNumber(String(phone))) {
        return { ok: false, error: "Invalid phone number" };
      }
    }
    if (field.type === "url" || vtype?.type === "url") {
      if (!z.string().url().safeParse(String(raw)).success) {
        return { ok: false, error: "Invalid URL" };
      }
    }

    cleaned[field.name] = sanitize(raw);
  }

  const customerName = String(
    cleaned.full_name ?? cleaned.name ?? ""
  );
  const email = String(cleaned.email ?? "");
  let phone = "";
  const phoneVal = cleaned.phone;
  if (phoneVal && typeof phoneVal === "object") {
    phone = String((phoneVal as { internationalNumber?: string }).internationalNumber ?? "");
  } else if (phoneVal) {
    phone = String(phoneVal);
  }

  // Insert via security-definer RPC (anon)
  const { data: submissionId, error } = await supabase.rpc("submit_public_form", {
    p_form_id: formId,
    p_form_type: formType,
    p_entity_type: entityType ?? null,
    p_entity_id: entityId ?? null,
    p_customer_name: customerName || null,
    p_email: email || null,
    p_phone: phone || null,
    p_ip: ip,
    p_values: cleaned as Json,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  // Send emails (best effort — never block submission on email failure)
  try {
    await sendSubmissionEmails({
      formType,
      formId,
      entityType: entityType ?? null,
      entityId: entityId ?? null,
      submissionId: String(submissionId),
      cleaned,
      customerName,
      email,
      phone,
    });
  } catch {
    // ignore email errors for the user
  }

  return { ok: true };
}

const TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  course: { en: "Course", ar: "الدورة" },
  career: { en: "Job", ar: "الوظيفة" },
  service: { en: "Service", ar: "الخدمة" },
  contact: { en: "Subject", ar: "الموضوع" },
  custom: { en: "Form", ar: "النموذج" },
};

async function resolveEntityName(entityType: string | null, entityId: string | null): Promise<{ en: string; ar: string } | null> {
  if (!entityType || !entityId) return null;
  const admin = createAdminClient();
  try {
    if (entityType === "course") {
      const { data } = await admin.from("courses").select("title_en,title_ar").eq("id", entityId).maybeSingle();
      return data ? { en: data.title_en, ar: data.title_ar } : null;
    }
    if (entityType === "career" || entityType === "job") {
      const { data } = await admin.from("jobs").select("title_en,title_ar").eq("id", entityId).maybeSingle();
      return data ? { en: data.title_en, ar: data.title_ar } : null;
    }
    if (entityType === "service") {
      const { data } = await admin.from("services").select("title_en,title_ar").eq("id", entityId).maybeSingle();
      return data ? { en: data.title_en, ar: data.title_ar } : null;
    }
  } catch {
    return null;
  }
  return null;
}

async function sendSubmissionEmails(opts: {
  formType: string;
  formId: string;
  entityType: string | null;
  entityId: string | null;
  submissionId: string;
  cleaned: Record<string, unknown>;
  customerName: string;
  email: string;
  phone: string;
}) {
  const { formType, formId, entityType, entityId, submissionId, cleaned, customerName, email, phone } = opts;
  const admin = createAdminClient();

  const { data: form } = await admin.from("forms").select("*").eq("id", formId).maybeSingle();
  if (!form) return;

  const templateKey =
    formType === "contact"
      ? "contact_received"
      : formType === "service"
        ? "service_request_received"
        : formType === "career"
          ? "job_application_received"
          : formType === "course"
            ? "course_registration_received"
            : "admin_notification";

  const entity = await resolveEntityName(entityType, entityId);
  const locale = detectLocale(cleaned);

  const subject = String(cleaned.subject ?? "");
  const message = String(cleaned.message ?? cleaned.project_details ?? cleaned.cover_letter ?? "");
  const entityName = locale === "ar" ? entity?.ar ?? "" : entity?.en ?? "";
  const typeLabel = TYPE_LABELS[formType] ?? TYPE_LABELS.custom;

  const requestDate = new Date().toLocaleString(locale === "ar" ? "ar-JO" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const baseVars: Record<string, string | number> = {
    customer_name: customerName,
    request_id: submissionId.slice(0, 8).toUpperCase(),
    request_date: requestDate,
    customer_email: email,
    customer_phone: phone,
    subject,
    message,
    company_name: "3DMCC",
  };

  if (formType === "course") baseVars.course_name = entityName;
  if (formType === "career") baseVars.job_title = entityName;
  if (formType === "service") baseVars.service_name = entityName;

  // Admin notification
  if (form.email_notification) {
    const to = form.recipient_email ?? process.env.SMTP_FROM_EMAIL ?? "info@3dmcc.net";
    const adminVars: Record<string, string | number> = {
      ...baseVars,
      type: locale === "ar" ? typeLabel.ar : typeLabel.en,
      entity_name: entityName,
      entity_label: locale === "ar" ? typeLabel.ar : typeLabel.en,
    };
    await sendTemplateEmail({ to, locale, templateKey: "admin_notification", vars: adminVars });
  }

  // Auto-reply to customer
  if (form.auto_reply && email) {
    await sendTemplateEmail({ to: email, locale, templateKey, vars: baseVars });
  }
}
