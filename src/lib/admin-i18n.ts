import "server-only";
import { cookies } from "next/headers";
import adminEn from "../../messages/admin.en.json";
import adminAr from "../../messages/admin.ar.json";

export type AdminLocale = "en" | "ar";

const enDict = adminEn as Record<string, string>;
const arDict = adminAr as Record<string, string>;

export async function getAdminLocale(): Promise<AdminLocale> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_locale")?.value === "ar" ? "ar" : "en";
}

export async function getAdminT() {
  const locale = await getAdminLocale();
  const dict = locale === "ar" ? arDict : enDict;
  return {
    locale,
    t: (key: string) => dict[key] ?? key,
  };
}
