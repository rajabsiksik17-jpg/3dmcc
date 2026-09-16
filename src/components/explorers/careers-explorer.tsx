"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { localized } from "@/lib/utils";
import type { JobRow } from "@/types/database";
import { JobCard } from "@/components/cards/job-card";
import { Search } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const TYPES = ["full_time", "part_time", "contract", "internship", "freelance"] as const;

export function CareersExplorer({ jobs }: { jobs: JobRow[] }) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("employmentTypes");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesType = type === "all" || j.employment_type === type;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        j.title_en.toLowerCase().includes(q) ||
        j.title_ar.toLowerCase().includes(q) ||
        (j.department_en?.toLowerCase().includes(q) ?? false) ||
        (j.location_en?.toLowerCase().includes(q) ?? false);
      return matchesType && matchesQuery;
    });
  }, [jobs, query, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400 ltr:left-3 rtl:right-3" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={locale === "ar" ? "ابحث عن وظيفة..." : "Search jobs..."}
            className="input ltr:pl-9 rtl:pr-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setType("all");
              setPage(1);
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              type === "all"
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-charcoal-200 text-charcoal-700 hover:border-brand-300"
            )}
          >
            {locale === "ar" ? "الكل" : "All"}
          </button>
          {TYPES.map((ty) => (
            <button
              key={ty}
              onClick={() => {
                setType(ty);
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                type === ty
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-charcoal-200 text-charcoal-700 hover:border-brand-300"
              )}
            >
              {t(ty)}
            </button>
          ))}
        </div>
      </div>

      {pageItems.length === 0 ? (
        <p className="py-16 text-center text-charcoal-500">
          {locale === "ar" ? "لا توجد وظائف مطابقة." : "No matching positions."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      )}

      {filtered.length > perPage && (
        <div className="mt-10">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
