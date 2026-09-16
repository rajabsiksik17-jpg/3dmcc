import type { MetadataRoute } from "next";
import { getServices, getCourses, getJobs } from "@/lib/data/public";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = absoluteUrl("");
  const now = new Date();

  const [services, courses, jobs] = await Promise.all([
    getServices(),
    getCourses(),
    getJobs(),
  ]);

  const staticPaths = [
    "",
    "/about",
    "/services",
    "/courses",
    "/careers",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["en", "ar"]) {
    for (const p of staticPaths) {
      entries.push({
        url: `${base}/${locale}${p}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.8,
      });
    }
    for (const s of services) {
      entries.push({
        url: `${base}/${locale}/services/${s.slug}`,
        lastModified: s.updated_at ? new Date(s.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const c of courses) {
      entries.push({
        url: `${base}/${locale}/courses/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const j of jobs) {
      entries.push({
        url: `${base}/${locale}/careers/${j.slug}`,
        lastModified: j.updated_at ? new Date(j.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
