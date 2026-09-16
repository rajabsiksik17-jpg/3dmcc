import type { Locale } from "@/i18n/routing";

export function pick<T>(locale: Locale, en: T, ar: T): T {
  return locale === "ar" ? ar : en;
}

export function localized(
  locale: Locale,
  fields: { en?: string | null; ar?: string | null } | undefined | null
): string {
  if (!fields) return "";
  return locale === "ar" ? fields.ar ?? fields.en ?? "" : fields.en ?? fields.ar ?? "";
}

export function formatDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://3dmcc.net";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
